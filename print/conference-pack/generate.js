#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');
const PDFDocument = require('pdfkit');

const OUT = __dirname;
const WIDTH = 2480;
const HEIGHT = 3508;
const PDF_WIDTH = 595.2756;
const PDF_HEIGHT = 841.8898;
const RED = '#ef4444';
const NEUTRAL_500 = '#737373';
const NEUTRAL_400 = '#a3a3a3';

const FONT_FILES = [
  '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
  '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
  '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf',
  '/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf',
];

const FONT_CSS = `
  @font-face { font-family: 'Site Sans'; src: url(data:font/ttf;base64,${fs.readFileSync(FONT_FILES[0]).toString('base64')}); font-weight: 400; }
  @font-face { font-family: 'Site Sans'; src: url(data:font/ttf;base64,${fs.readFileSync(FONT_FILES[1]).toString('base64')}); font-weight: 700 900; }
  @font-face { font-family: 'Site Mono'; src: url(data:font/ttf;base64,${fs.readFileSync(FONT_FILES[2]).toString('base64')}); font-weight: 400; }
  @font-face { font-family: 'Site Mono'; src: url(data:font/ttf;base64,${fs.readFileSync(FONT_FILES[3]).toString('base64')}); font-weight: 700 900; }
`;

const logoPng = fs.readFileSync(path.resolve(OUT, '../../public/brand/aisb-logo-on-light.png'));
const logoData = `data:image/png;base64,${logoPng.toString('base64')}`;
const qrSvg = fs.readFileSync(path.join(OUT, 'qr-sf26.svg'), 'utf8');
const qrPng = new Resvg(qrSvg, { fitTo: { mode: 'width', value: 900 } }).render().asPng();
const qrData = `data:image/png;base64,${qrPng.toString('base64')}`;

function esc(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function lines(items, x, y, className, fontSize, lineHeight, options = {}) {
  const { fill, anchor = 'start', letterSpacing } = options;
  const style = [
    `font-size:${fontSize}px`,
    fill ? `fill:${fill}` : '',
    letterSpacing !== undefined ? `letter-spacing:${letterSpacing}px` : '',
  ].filter(Boolean).join(';');
  return `<text x="${x}" y="${y}" class="${className}" text-anchor="${anchor}" style="${style}">${items
    .map((item, index) => `<tspan x="${x}" dy="${index ? lineHeight : 0}">${esc(item)}</tspan>`)
    .join('')}</text>`;
}

function baseSvg(body) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="210mm" height="297mm" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <style>
    ${FONT_CSS}
    text { fill: #000; }
    .display { font-family: 'Site Sans', sans-serif; font-weight: 900; letter-spacing: -5px; }
    .heading { font-family: 'Site Sans', sans-serif; font-weight: 900; letter-spacing: -2px; }
    .body { font-family: 'Site Sans', sans-serif; font-weight: 400; }
    .body-bold { font-family: 'Site Sans', sans-serif; font-weight: 700; }
    .label { font-family: 'Site Sans', sans-serif; font-weight: 900; letter-spacing: 5px; }
    .mono { font-family: 'Site Mono', monospace; font-weight: 400; }
    .mono-bold { font-family: 'Site Mono', monospace; font-weight: 700; }
  </style>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#fff"/>
  ${body}
</svg>`;
}

// The official brand file has a square canvas. This crops its unchanged mark
// to the visible wordmark bounds while retaining the embedded brand font and red square.
let logoIndex = 0;
function brandLogo(x, y, width) {
  const scale = width / 740;
  const height = 285 * scale;
  const id = `logo-clip-${logoIndex++}`;
  return `
    <defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${width}" height="${height}"/></clipPath></defs>
    <g clip-path="url(#${id})">
      <image href="${logoData}" x="${x - 130 * scale}" y="${y - 350 * scale}" width="${1000 * scale}" height="${1000 * scale}"/>
    </g>`;
}

function rule(y, x1 = 160, x2 = 2320, stroke = 6) {
  return `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#000" stroke-width="${stroke}"/>`;
}

function redSquare(x, y, size = 24) {
  return `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${RED}"/>`;
}

function qr(x, y, size, labelSize = 38) {
  return `
    <rect x="${x - 14}" y="${y - 14}" width="${size + 28}" height="${size + 28}" fill="#fff" stroke="#000" stroke-width="5"/>
    <image href="${qrData}" x="${x}" y="${y}" width="${size}" height="${size}" image-rendering="pixelated"/>
    <text x="${x + size / 2}" y="${y + size + 66}" class="body-bold" text-anchor="middle" style="font-size:${labelSize}px">aisb.dev/sf26</text>`;
}

function applyButton(x, y, width = 440, height = 132, fontSize = 43) {
  return `
    <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${RED}"/>
    <text x="${x + width / 2}" y="${y + height / 2 + fontSize * 0.36}" class="label" text-anchor="middle" fill="#fff" style="fill:#fff;font-size:${fontSize}px;letter-spacing:4px">APPLY NOW</text>`;
}

function sf26PosterSvg() {
  return baseSvg(`
    ${brandLogo(160, 120, 420)}

    <text x="160" y="530" class="label" style="fill:${RED};font-size:42px">APPLICATIONS OPEN</text>
    ${lines(['AI Security', 'Bootcamp', 'San Francisco'], 160, 790, 'display', 235, 242)}

    ${lines([
      'A 7-day intensive program for security professionals',
      'shaping how we secure emerging AI systems.'
    ], 160, 1570, 'body', 50, 72, { fill: NEUTRAL_500 })}

    <text x="160" y="1795" class="label" style="font-size:34px;letter-spacing:4px">OCT 4-10, 2026</text>
    <text x="705" y="1795" class="body-bold" style="fill:${RED};font-size:42px">|</text>
    <text x="760" y="1795" class="label" style="font-size:34px;letter-spacing:4px">SAN FRANCISCO</text>
    <text x="1290" y="1795" class="body-bold" style="fill:${RED};font-size:42px">|</text>
    <text x="1345" y="1795" class="label" style="font-size:34px;letter-spacing:4px">IN-PERSON</text>
    <text x="1735" y="1795" class="body-bold" style="fill:${RED};font-size:42px">|</text>
    <text x="1790" y="1795" class="label" style="font-size:34px;letter-spacing:4px">FULLY FUNDED</text>

    ${applyButton(160, 1930)}
    ${qr(1770, 1835, 420, 38)}

    <text x="160" y="2220" class="body" style="fill:${NEUTRAL_500};font-size:42px">Application Deadline: <tspan class="body-bold" fill="#000">August 16, 2026</tspan></text>

    ${rule(2390)}
    <text x="160" y="2490" class="heading" style="font-size:62px">Who Should Attend</text>
    ${lines([
      'Security professionals ready to secure frontier AI systems at all stages:',
      'from user applications, to model APIs for developers; and from infrastructure',
      'hosting the models, to governance frameworks for emerging threats.'
    ], 160, 2590, 'body', 40, 62, { fill: NEUTRAL_500 })}

    <text x="160" y="2850" class="label" style="fill:${RED};font-size:32px">PREREQUISITES</text>
    ${lines([
      '7+ years of hands-on security experience. No prior AI or ML background needed.',
      'The pre-work covers what’s necessary.'
    ], 160, 2935, 'body', 40, 61, { fill: NEUTRAL_500 })}

    ${rule(3130)}
    <text x="160" y="3220" class="label" style="font-size:29px;fill:${NEUTRAL_500}">PAST PARTICIPANTS HAVE BEEN AFFILIATED WITH</text>
    <text x="160" y="3300" class="body-bold" style="font-size:34px">OpenAI · Google · Meta · Apple · Microsoft · AWS · Intel · Jane Street</text>
    <text x="160" y="3360" class="body-bold" style="font-size:34px">Stanford · Oxford · Cambridge · MIT · UC Berkeley · CERN</text>
    <text x="160" y="3440" class="body" style="fill:${NEUTRAL_400};font-size:29px">pranav@aisb.dev</text>
  `);
}

const curriculum = [
  ['DAY 1', ['Introduction & Threat Modeling']],
  ['DAY 2', ['Adversarial Attacks, Watermarking', '& Data Security']],
  ['DAY 3', ['LLM Security']],
  ['DAY 4', ['Infrastructure Security']],
  ['DAY 5', ['Weight Security, Verification', '& Formal Methods']],
  ['DAY 6', ['Data Center Security & ML Stack', 'Threat Modeling']],
  ['DAY 7', ['AI Control & Hardware Governance']],
];

function curriculumRows() {
  const startY = 1220;
  const rowHeight = 260;
  return curriculum.map(([day, title], index) => {
    const top = startY + index * rowHeight;
    return `
      <line x1="160" y1="${top}" x2="1480" y2="${top}" stroke="#000" stroke-width="5"/>
      <text x="160" y="${top + 91}" class="label" style="fill:${RED};font-size:30px;letter-spacing:3px">${day}</text>
      ${lines(title, 370, top + 91, 'heading', 44, 61)}
    `;
  }).join('') + `<line x1="160" y1="${startY + curriculum.length * rowHeight}" x2="1480" y2="${startY + curriculum.length * rowHeight}" stroke="#000" stroke-width="5"/>`;
}

function sf26ProgramSvg() {
  return baseSvg(`
    ${brandLogo(160, 110, 390)}
    <text x="2320" y="230" class="label" text-anchor="end" style="fill:${RED};font-size:32px">SAN FRANCISCO 2026</text>
    ${rule(360)}

    <text x="160" y="620" class="display" style="font-size:185px">The Program</text>
    ${lines([
      'AI Security Bootcamp explores the rapidly evolving threat landscape of frontier AI systems,',
      'equipping security professionals with the knowledge and hands-on skills to secure against',
      'current and emerging risks.'
    ], 160, 770, 'body', 42, 63, { fill: NEUTRAL_500 })}
    <text x="160" y="1045" class="label" style="font-size:31px">OCT 4-10, 2026  <tspan fill="${RED}">|</tspan>  IN-PERSON  <tspan fill="${RED}">|</tspan>  FULLY FUNDED</text>

    ${curriculumRows()}

    <line x1="1555" y1="1220" x2="1555" y2="3040" stroke="#000" stroke-width="5"/>
    <text x="1640" y="1310" class="heading" style="font-size:60px">Who Should Attend</text>
    ${lines([
      'We want our cohort to span a wide',
      'range of expertise. Whether your',
      'background is offensive security,',
      'incident response, threat intelligence,',
      'infrastructure, or application security,',
      'the AI-specific threat models and',
      'techniques we cover will push what you',
      'already know into new territory.'
    ], 1640, 1420, 'body', 35, 56, { fill: NEUTRAL_500 })}

    <text x="1640" y="1935" class="label" style="fill:${RED};font-size:29px">PREREQUISITES</text>
    ${lines([
      '7+ years of hands-on security',
      'experience. No prior AI or ML',
      'background needed. The pre-work',
      'covers what’s necessary.'
    ], 1640, 2025, 'body', 36, 58, { fill: NEUTRAL_500 })}

    <text x="1640" y="2325" class="label" style="fill:${RED};font-size:29px">COST &amp; SELECTION</text>
    <text x="1640" y="2415" class="body-bold" style="font-size:38px">The program is free to attend.</text>
    ${lines([
      'Tuition, meals during program hours,',
      'materials, and accommodation in San',
      'Francisco are fully covered for accepted',
      'participants. Need-based travel support',
      'is available.'
    ], 1640, 2490, 'body', 34, 55, { fill: NEUTRAL_500 })}

    ${qr(1850, 2750, 300, 31)}

    ${rule(3135)}
    <text x="160" y="3230" class="heading" style="font-size:61px">What You’ll Learn</text>
    ${redSquare(160, 3293, 19)}
    <text x="210" y="3315" class="body" style="fill:${NEUTRAL_500};font-size:32px">Develop a threat model for frontier AI systems.</text>
    ${redSquare(160, 3360, 19)}
    <text x="210" y="3382" class="body" style="fill:${NEUTRAL_500};font-size:32px">Build hands-on capability across the full attack surface.</text>
    <text x="2320" y="3445" class="body-bold" text-anchor="end" style="font-size:32px">Applications close August 16, 2026</text>
  `);
}

function aisbOverviewSvg() {
  return baseSvg(`
    ${brandLogo(160, 110, 420)}
    ${rule(365)}

    ${lines(['AI Security', 'Bootcamp'], 160, 655, 'display', 215, 220)}
    <text x="160" y="1135" class="body" style="fill:${NEUTRAL_500};font-size:53px">Training professionals to shape how we secure frontier AI systems.</text>
    <text x="160" y="1260" class="label" style="font-size:31px">ADVERSARIAL ML  <tspan fill="${RED}">|</tspan>  LLM SECURITY  <tspan fill="${RED}">|</tspan>  INFRASTRUCTURE &amp; GOVERNANCE</text>

    ${rule(1385)}
    <text x="160" y="1535" class="heading" style="font-size:90px">About</text>
    ${lines([
      'As AI systems become more capable and integrated into critical infrastructure, new',
      'attack surfaces and failure modes are emerging that traditional security training doesn’t',
      'cover. We bring together experienced security professionals and equip them with the threat',
      'models, techniques, and hands-on skills needed to engage with the most pressing AI security',
      'challenges.',
      '',
      'Each cohort is small and intensive, designed so peer learning between practitioners is a',
      'meaningful part of the experience. Participants come from offensive security, incident',
      'response, threat intelligence, infrastructure, and application security backgrounds; the',
      'AI-specific material we cover pushes that experience into new territory.',
      '',
      'We run cohorts in different cities, partnering with local AI safety and security organisations.',
      'Our programs are free to attend and fully funded for accepted participants.'
    ], 160, 1650, 'body', 38, 58, { fill: NEUTRAL_500 })}

    ${rule(2480)}
    <text x="160" y="2600" class="heading" style="font-size:76px">Cohorts</text>
    <rect x="160" y="2690" width="1320" height="400" fill="#fff" stroke="#000" stroke-width="5"/>
    <text x="220" y="2780" class="label" style="fill:${RED};font-size:28px">UPCOMING</text>
    <text x="220" y="2885" class="heading" style="font-size:54px">AISB San Francisco <tspan fill="${NEUTRAL_400}">2026</tspan></text>
    <text x="220" y="2960" class="label" style="font-size:27px;letter-spacing:3px">7-DAY INTENSIVE · 20 PARTICIPANTS · OCTOBER 2026</text>
    <text x="220" y="3035" class="body" style="fill:${NEUTRAL_500};font-size:33px">Threat modelling, adversarial attacks, LLM and infrastructure security.</text>

    <rect x="1555" y="2690" width="765" height="400" fill="#fff" stroke="#000" stroke-width="5"/>
    <text x="1615" y="2780" class="label" style="fill:${RED};font-size:28px">APPLICATIONS OPEN</text>
    <text x="1615" y="2880" class="body" style="fill:${NEUTRAL_500};font-size:34px">Oct 4-10, 2026</text>
    <text x="1615" y="2950" class="body-bold" style="font-size:34px">Deadline: August 16</text>
    ${qr(2070, 2820, 185, 24)}

    ${rule(3190)}
    <text x="160" y="3280" class="label" style="font-size:28px;fill:${NEUTRAL_500}">PAST PARTICIPANTS HAVE BEEN AFFILIATED WITH</text>
    <text x="160" y="3360" class="body-bold" style="font-size:34px">OpenAI · Google · Meta · Microsoft · Apple · AWS · Stanford · Oxford · MIT</text>
    <text x="160" y="3440" class="body" style="fill:${NEUTRAL_400};font-size:29px">aisb.dev  ·  pranav@aisb.dev  ·  Fiscally sponsored by BlueDot Impact</text>
  `);
}

function miniCard(x, y, width, height) {
  const qSize = 330;
  return `
    <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="#fff" stroke="#000" stroke-width="5"/>
    ${brandLogo(x + 60, y + 55, 250)}
    <text x="${x + 60}" y="${y + 275}" class="label" style="fill:${RED};font-size:25px;letter-spacing:3px">APPLICATIONS OPEN</text>
    ${lines(['AI Security', 'Bootcamp', 'San Francisco'], x + 60, y + 400, 'display', 79, 84)}
    ${lines([
      'A 7-day intensive program for security professionals',
      'shaping how we secure emerging AI systems.'
    ], x + 60, y + 700, 'body', 29, 48, { fill: NEUTRAL_500 })}
    <text x="${x + 60}" y="${y + 850}" class="label" style="font-size:24px;letter-spacing:2px">OCT 4-10 · IN-PERSON · FULLY FUNDED</text>
    <text x="${x + 60}" y="${y + 970}" class="body" style="fill:${NEUTRAL_500};font-size:31px">Application Deadline:</text>
    <text x="${x + 60}" y="${y + 1020}" class="body-bold" style="font-size:35px">August 16, 2026</text>
    <text x="${x + 60}" y="${y + 1125}" class="body" style="fill:${NEUTRAL_500};font-size:29px">7+ years of hands-on security experience.</text>
    <text x="${x + 60}" y="${y + 1175}" class="body" style="fill:${NEUTRAL_500};font-size:29px">No prior AI or ML background needed.</text>
    ${qr(x + width - qSize - 65, y + height - qSize - 125, qSize, 29)}
    <rect x="${x + 60}" y="${y + height - 330}" width="305" height="96" fill="${RED}"/>
    <text x="${x + 212}" y="${y + height - 268}" class="label" text-anchor="middle" style="fill:#fff;font-size:27px;letter-spacing:3px">APPLY NOW</text>
    <text x="${x + 60}" y="${y + height - 135}" class="body" style="fill:${NEUTRAL_400};font-size:27px">pranav@aisb.dev</text>`;
}

function miniFlyersSvg() {
  const marginX = 88;
  const marginY = 88;
  const gap = 44;
  const cardW = (WIDTH - marginX * 2 - gap) / 2;
  const cardH = (HEIGHT - marginY * 2 - gap) / 2;
  const x2 = marginX + cardW + gap;
  const y2 = marginY + cardH + gap;
  const midX = WIDTH / 2;
  const midY = HEIGHT / 2;
  return baseSvg(`
    ${miniCard(marginX, marginY, cardW, cardH)}
    ${miniCard(x2, marginY, cardW, cardH)}
    ${miniCard(marginX, y2, cardW, cardH)}
    ${miniCard(x2, y2, cardW, cardH)}
    <line x1="${midX}" y1="20" x2="${midX}" y2="70" stroke="#000" stroke-width="3"/>
    <line x1="${midX}" y1="${HEIGHT - 20}" x2="${midX}" y2="${HEIGHT - 70}" stroke="#000" stroke-width="3"/>
    <line x1="20" y1="${midY}" x2="70" y2="${midY}" stroke="#000" stroke-width="3"/>
    <line x1="${WIDTH - 20}" y1="${midY}" x2="${WIDTH - 70}" y2="${midY}" stroke="#000" stroke-width="3"/>
  `);
}

function tableSignSvg() {
  return baseSvg(`
    ${brandLogo(160, 115, 430)}
    <text x="160" y="550" class="label" style="fill:${RED};font-size:42px">APPLICATIONS OPEN</text>
    ${lines(['AI Security', 'Bootcamp', 'San Francisco'], 160, 790, 'display', 187, 195)}
    <text x="160" y="1450" class="label" style="font-size:33px">OCT 4-10, 2026  <tspan fill="${RED}">|</tspan>  IN-PERSON  <tspan fill="${RED}">|</tspan>  FULLY FUNDED</text>

    ${qr(795, 1590, 890, 50)}

    ${applyButton(710, 2675, 1060, 145, 46)}
    <text x="1240" y="2945" class="body" text-anchor="middle" style="fill:${NEUTRAL_500};font-size:45px">Application Deadline: <tspan class="body-bold" fill="#000">August 16, 2026</tspan></text>
    ${lines([
      'A 7-day intensive program for security professionals',
      'shaping how we secure emerging AI systems.'
    ], 1240, 3100, 'body', 42, 63, { fill: NEUTRAL_500, anchor: 'middle' })}
    ${rule(3300)}
    <text x="160" y="3390" class="body" style="fill:${NEUTRAL_400};font-size:31px">Questions: pranav@aisb.dev</text>
    <text x="2320" y="3390" class="body-bold" text-anchor="end" style="font-size:31px">aisb.dev/sf26</text>
  `);
}

function boothNotesSvg() {
  const facts = [
    ['WHEN', 'Sunday, Oct 4 through Saturday, Oct 10, 2026'],
    ['WHERE', 'San Francisco · in person'],
    ['COHORT', '16-20 participants · full attendance required'],
    ['EXPERIENCE', '7+ years hands-on security · no prior AI/ML required'],
    ['COST', 'Tuition, meals during program hours, materials, and accommodation covered'],
    ['TRAVEL', 'Need-based support is available'],
    ['DEADLINE', 'August 16 · applications reviewed on a rolling basis'],
  ];
  const factRows = facts.map(([label, value], index) => {
    const y = 1780 + index * 115;
    return `
      <text x="160" y="${y}" class="label" style="fill:${RED};font-size:25px;letter-spacing:3px">${label}</text>
      <text x="520" y="${y}" class="body" style="font-size:34px">${esc(value)}</text>
      <line x1="160" y1="${y + 49}" x2="2320" y2="${y + 49}" stroke="#000" stroke-width="2"/>`;
  }).join('');

  return baseSvg(`
    ${brandLogo(160, 105, 380)}
    <text x="2320" y="215" class="label" text-anchor="end" style="fill:${RED};font-size:29px">INTERNAL · BOOTH NOTES</text>
    ${rule(350)}
    <text x="160" y="585" class="display" style="font-size:170px">AISB San Francisco</text>

    <text x="160" y="760" class="heading" style="font-size:60px">The short version</text>
    ${lines([
      'The AI Security Bootcamp is an intensive, in-person program for security professionals',
      'working at the frontier of AI—the attack surfaces, control mechanisms, and governance',
      'challenges that become critical as AI systems grow more capable. We run cohorts in',
      'different cities; each is fully funded for accepted participants.'
    ], 160, 850, 'body', 38, 59, { fill: NEUTRAL_500 })}

    <text x="160" y="1165" class="heading" style="font-size:60px">Who we’re looking for</text>
    ${lines([
      'Senior security professionals from across the stack—offensive and defensive, application',
      'and infrastructure, detection and response. What matters most is substantial security',
      'experience and curiosity about frontier threat models.'
    ], 160, 1255, 'body', 38, 59, { fill: NEUTRAL_500 })}

    ${rule(1570)}
    <text x="160" y="1670" class="heading" style="font-size:60px">Key facts</text>
    ${factRows}

    ${rule(2645)}
    <text x="160" y="2750" class="heading" style="font-size:60px">Good questions to ask</text>
    ${redSquare(160, 2820, 20)}
    <text x="215" y="2845" class="body" style="font-size:35px">What kind of security work do you do?</text>
    ${redSquare(160, 2890, 20)}
    <text x="215" y="2915" class="body" style="font-size:35px">Are you already working on AI systems, or looking to move into the field?</text>
    ${redSquare(160, 2960, 20)}
    <text x="215" y="2985" class="body" style="font-size:35px">Which part of the stack do you care about most?</text>

    <text x="160" y="3125" class="label" style="fill:${RED};font-size:28px">BE PRECISE</text>
    <text x="160" y="3200" class="body" style="fill:${NEUTRAL_500};font-size:34px">Travel support is need-based. Selection is competitive. Do not promise either.</text>

    ${qr(1985, 2960, 280, 29)}
    ${rule(3350)}
    <text x="160" y="3440" class="body-bold" style="font-size:31px">Send them to aisb.dev/sf26 · Questions: pranav@aisb.dev</text>
  `);
}

function renderSvg(svg) {
  return new Resvg(svg, {
    fitTo: { mode: 'width', value: WIDTH },
    font: {
      fontFiles: FONT_FILES,
      loadSystemFonts: false,
      defaultFontFamily: 'DejaVu Sans',
    },
  }).render().asPng();
}

function makePdf(pages, destination) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      autoFirstPage: false,
      compress: true,
      info: {
        Title: 'AISB Conference Print Pack — San Francisco 2026',
        Author: 'AI Security Bootcamp',
        Subject: 'A4 conference materials based on the AISB website',
      },
    });
    const stream = fs.createWriteStream(destination);
    stream.on('finish', resolve);
    stream.on('error', reject);
    doc.pipe(stream);
    for (const page of pages) {
      doc.addPage({ size: [PDF_WIDTH, PDF_HEIGHT], margin: 0 });
      doc.image(page, 0, 0, { width: PDF_WIDTH, height: PDF_HEIGHT });
    }
    doc.end();
  });
}

async function main() {
  logoIndex = 0;
  const outputs = [
    ['sf26-poster-a4', sf26PosterSvg()],
    ['sf26-program-a4', sf26ProgramSvg()],
    ['aisb-overview-a4', aisbOverviewSvg()],
    ['sf26-mini-flyers-a4', miniFlyersSvg()],
    ['sf26-table-sign-a4', tableSignSvg()],
    ['sf26-booth-notes-a4', boothNotesSvg()],
  ];
  const rendered = [];

  for (const [name, svg] of outputs) {
    fs.writeFileSync(path.join(OUT, `${name}.svg`), svg);
    const png = renderSvg(svg);
    fs.writeFileSync(path.join(OUT, `${name}.png`), png);
    await makePdf([png], path.join(OUT, `${name}.pdf`));
    rendered.push(png);
    console.log(`generated ${name}.{svg,png,pdf}`);
  }

  await makePdf(rendered, path.join(OUT, 'aisb-conference-pack-a4.pdf'));
  console.log('generated aisb-conference-pack-a4.pdf');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
