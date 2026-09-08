#!/usr/bin/env python3
"""Encode an existing captioned master as static-hostable adaptive HLS + MP4.

Requires FFmpeg/ffprobe, Python 3.11+, and a lossless audio master. No service,
API key, or original interview library is needed. Uses a new versioned folder;
refuses to overwrite an existing delivery.
"""
import argparse
from concurrent.futures import ThreadPoolExecutor
import hashlib
import json
import math
from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
LADDER = [(360, 450, '3.1'), (540, 850, '3.1'), (720, 1450, '3.1'), (1080, 2800, '4.0')]


def run(args):
    return subprocess.run([str(a) for a in args], check=True, capture_output=True, text=True)


def sha(path):
    with path.open('rb') as file:
        return hashlib.file_digest(file, 'sha256').hexdigest()


def probe(path):
    return json.loads(run(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', path]).stdout)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('master', type=Path)
    parser.add_argument('--audio-master', type=Path, required=True)
    parser.add_argument('--timeline', type=Path, required=True)
    parser.add_argument('--output', type=Path, default=ROOT/'public/video/aisb-hero-v5')
    args = parser.parse_args()
    assert args.master.is_file() and args.audio_master.is_file()
    master_sha, audio_sha = sha(args.master), sha(args.audio_master)
    timeline = json.loads(args.timeline.read_text())
    duration = timeline['duration']
    args.output.mkdir(parents=True, exist_ok=False)

    def encode(item):
        height, bitrate, level = item
        directory = args.output/str(height)
        directory.mkdir()
        playlist = directory/'index.m3u8'
        run(['ffmpeg', '-v', 'error', '-y', '-i', args.master, '-i', args.audio_master,
             '-map', '0:v:0', '-map', '1:a:0', '-t', duration,
             '-vf', f'scale=-2:{height}:flags=lanczos,setsar=1', '-r', '25',
             '-c:v', 'libx264', '-preset', 'slow', '-threads', '2', '-crf', '23',
             '-maxrate', f'{bitrate}k', '-bufsize', f'{bitrate*2}k',
             '-profile:v', 'high', '-level:v', level, '-pix_fmt', 'yuv420p',
             '-g', '50', '-keyint_min', '50', '-sc_threshold', '0',
             '-force_key_frames', 'expr:gte(t,n_forced*2)', '-flags', '+cgop',
             '-c:a', 'aac', '-b:a', '96k', '-ar', '48000', '-ac', '2',
             '-f', 'hls', '-hls_time', '2', '-hls_playlist_type', 'vod',
             '-hls_segment_type', 'fmp4', '-hls_flags', 'independent_segments',
             '-hls_fmp4_init_filename', 'init.mp4',
             '-hls_segment_filename', directory/'segment-%03d.m4s', playlist])
        text = playlist.read_text()
        lengths = [float(x) for x in re.findall(r'#EXTINF:([\d.]+)', text)]
        segments = [directory/line for line in text.splitlines() if line and not line.startswith('#')]
        assert len(segments) == len(lengths) == math.ceil(duration/2)
        assert abs(sum(lengths)-duration) < .001
        assert all(abs(length-2) < .001 for length in lengths[:-1])
        assert '#EXT-X-INDEPENDENT-SEGMENTS' in text and '#EXT-X-ENDLIST' in text
        run(['ffmpeg', '-v', 'error', '-xerror', '-i', playlist, '-f', 'null', '-'])
        frames = json.loads(run(['ffprobe', '-v', 'error', '-select_streams', 'v:0',
            '-show_frames', '-show_entries', 'frame=key_frame,best_effort_timestamp_time',
            '-of', 'json', playlist]).stdout)['frames']
        keys = [float(f['best_effort_timestamp_time']) for f in frames if f['key_frame']]
        assert len(keys) == len(segments)
        assert all(abs(t-keys[0]-2*i)<.001 for i,t in enumerate(keys))
        peak = math.ceil(max(p.stat().st_size*8/t for p,t in zip(segments,lengths))*1.1)
        average = math.ceil(sum(p.stat().st_size for p in segments)*8/duration)
        info = probe(playlist)
        video = next(s for s in info['streams'] if s['codec_type']=='video')
        audio = next(s for s in info['streams'] if s['codec_type']=='audio')
        assert abs(float(video['start_time'])-float(audio['start_time'])) < .05
        report = dict(height=height,width=video['width'],max_video_kbps=bitrate,
            bandwidth=peak,average_bandwidth=average,segment_seconds=lengths,
            first_segment_bytes=segments[0].stat().st_size,
            bytes=sum(p.stat().st_size for p in directory.iterdir()),
            keyframes=keys,decode='passed',codec='avc1.640028' if height==1080 else 'avc1.64001f')
        print(f'{height}p encoded and verified: {report["bytes"]/1e6:.2f} MB, first segment {report["first_segment_bytes"]/1000:.0f} KB', flush=True)
        return report

    with ThreadPoolExecutor(max_workers=2) as pool:
        variants = list(pool.map(encode, LADDER))
    assert all(v['keyframes'] == variants[0]['keyframes'] for v in variants)
    lines = ['#EXTM3U', '#EXT-X-VERSION:7', '#EXT-X-INDEPENDENT-SEGMENTS']
    for v in variants:
        lines += [f'#EXT-X-STREAM-INF:BANDWIDTH={v["bandwidth"]},AVERAGE-BANDWIDTH={v["average_bandwidth"]},RESOLUTION={v["width"]}x{v["height"]},FRAME-RATE=25.000,CODECS="{v["codec"]},mp4a.40.2"',f'{v["height"]}/index.m3u8']
    (args.output/'master.m3u8').write_text('\n'.join(lines)+'\n')
    # Remux the 540p stream: no additional lossy generation for the fallback.
    fallback = args.output/'fallback.mp4'
    run(['ffmpeg','-v','error','-y','-i',args.output/'540/index.m3u8','-map','0:v:0','-map','0:a:0',
         '-c','copy','-movflags','+faststart',fallback])
    run(['ffmpeg','-v','error','-xerror','-i',fallback,'-f','null','-'])
    payload = fallback.read_bytes()
    assert payload.index(b'moov') < payload.index(b'mdat'), 'Fallback is not fast-start'
    text = ['A week at AISB — Start securing the frontier of AI', f'Duration: {duration:.2f} seconds.', '']
    for voice in timeline['dialogue']:
        cues = [c for c in timeline['captions'] if c['row']==voice['row']]
        at = voice['at']
        text += [f'{int(at//60):02}:{at%60:05.2f} — {cues[0]["speaker"]}',
                 ' '.join(c['text'].replace('\n',' ') for c in cues), '']
    text += ['End card: Start securing the frontier of AI. Apply now.', '',
             'Music: "Effervescence" by Scott Buckley — CC BY 4.0.',
             'https://www.scottbuckley.com.au/library/effervescence/',
             'https://creativecommons.org/licenses/by/4.0/',
             'Music excerpted, faded and mixed.']
    (args.output/'transcript.txt').write_text('\n'.join(text)+'\n')
    assert sha(args.master)==master_sha and sha(args.audio_master)==audio_sha
    report = dict(complete=True,revision=timeline['revision'],duration=duration,master_sha256=master_sha,
        lossless_audio_sha256=audio_sha,audio='96 kbps AAC encoded directly from the lossless mix, not lossy delivery audio',
        variants=variants,fallback=dict(height=540,bytes=fallback.stat().st_size,fast_start=True,sha256=sha(fallback)),
        sources_unchanged=True,aligned_two_second_keyframes=True)
    (args.output/'encoding.json').write_text(json.dumps(report,indent=2)+'\n')
    print(f'Web package complete: {args.output}', flush=True)


if __name__ == '__main__': main()
