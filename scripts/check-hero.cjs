/* Run against npm run dev or a static server serving out/. */
const { chromium } = require('@playwright/test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const url = process.env.HERO_TEST_URL || 'http://127.0.0.1:3333/';
const output = path.resolve('test-results/hero');
const mediaRequest = url => /\/video\/aisb-hero-v5\//.test(url);
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true,
    executablePath: process.env.HERO_BROWSER_EXECUTABLE || (fs.existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined),
    args: ['--no-sandbox'] });
  const report = { url, browser: browser.version(), checks: [], errors: [] };
  const contexts = [];
  async function pageFor(options = {}) {
    const context = await browser.newContext({viewport:{width:1440,height:1000},...options});
    contexts.push(context);
    // Never send site analytics from automated QA.
    await context.route('https://**/*', route => route.abort());
    const page = await context.newPage();
    page.on('pageerror', e => report.errors.push(e.message));
    return page;
  }
  async function isPlaying(page) {
    await page.waitForFunction(() => {
      const v = document.querySelector('[data-testid="hero-film"]');
      return v && !v.paused && v.readyState >= 2 && v.currentTime > .15;
    }, null, {timeout:30000});
  }
  async function video(page) {
    return page.getByTestId('hero-film').evaluate(v => ({paused:v.paused, muted:v.muted,
      time:v.currentTime, duration:Number.isFinite(v.duration)?v.duration:null, width:v.videoWidth,height:v.videoHeight,
      preload:v.preload,buffered:v.buffered.length?v.buffered.end(v.buffered.length-1):0,
      controls:v.controls,loop:v.loop,autoplay:v.autoplay,src:v.getAttribute('src'),
      mode:v.dataset.playback,error:v.error?.message}));
  }
  const playButton = page => page.getByRole('button',{name:'Watch A week at AISB with sound',exact:true});

  try {
    const page = await pageFor({deviceScaleFactor:2});
    const requests = [];
    page.on('request', r => { if(mediaRequest(r.url())) requests.push(r.url()); });
    await page.goto(url, {waitUntil:'domcontentloaded'});
    await playButton(page).waitFor();
    await page.waitForFunction(()=>document.querySelector('[data-testid="hero-film"]')?.readyState>=2,null,{timeout:30000});
    let state = await video(page);
    assert(state.paused && state.time===0 && !state.autoplay && !state.loop && !state.controls);
    assert.equal(state.preload,'auto');
    assert(state.buffered>0,'The opening did not preload');
    assert(requests.some(u=>u.endsWith('.m4s')),'No media segments preloaded');
    assert.equal(await page.getByTestId('hero-film-poster').locator('img').evaluate(i=>i.naturalWidth),1280);
    assert.equal((await playButton(page).innerText()).replace(/\s+/g,' ').trim(),'A week at AISB');
    assert(await page.getByTestId('hero-film-play-icon').isVisible(),'Play overlay is missing');
    assert.equal(await playButton(page).locator('svg').count(),1);
    assert.equal(await page.getByText('Transcript & credits',{exact:true}).count(),0);
    assert.equal(await page.getByText('London · In person',{exact:true}).count(),0);
    report.checks.push({stillPosterByDefault:true,preloadsWithoutPlaying:true,centeredPlayOverlay:true,initial:state});

    for (const width of [1440,768,390,320]) {
      await page.setViewportSize({width,height:1000});
      await page.getByTestId('hero-film').scrollIntoViewIfNeeded();
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth), `Overflow at ${width}`);
      assert.equal(await page.getByTestId('hero-topics').isVisible(),width>=768,`Topic list visibility is incorrect at ${width}`);
      const box = await page.getByTestId('hero-film').boundingBox();
      assert(Math.abs(box.width/box.height-16/9)<.02);
      const posterBox = await playButton(page).boundingBox();
      const iconBox = await page.getByTestId('hero-film-play-icon').boundingBox();
      assert.equal(iconBox.width,iconBox.height,'Play overlay is not square');
      assert.equal(await page.getByTestId('hero-film-play-icon').evaluate(el=>getComputedStyle(el).borderRadius),'0px');
      assert(Math.abs(iconBox.x+iconBox.width/2-posterBox.x-posterBox.width/2)<1, `Play overlay off-center horizontally at ${width}`);
      assert(Math.abs(iconBox.y+iconBox.height/2-posterBox.y-posterBox.height/2)<1, `Play overlay off-center vertically at ${width}`);
      await page.getByTestId('hero-film').locator('../..').screenshot({path:path.join(output,`film-${width}.png`)});
      assert((await video(page)).paused);
    }
    report.checks.push({responsive:[1440,768,390,320],uncropped16by9:true,noAutoplayOnScroll:true});
    const mobileLayouts = [];
    for (const [width,height] of [[320,568],[360,640],[375,548],[375,667],[390,664],[390,844],[430,932]]) {
      await page.setViewportSize({width,height});
      await page.evaluate(()=>window.scrollTo(0,0));
      const heading = await page.getByRole('heading',{level:1}).boundingBox();
      const film = await playButton(page).boundingBox();
      const carousel = await page.getByTestId('hero-affiliations').boundingBox();
      const hero = await page.getByTestId('homepage-hero').boundingBox();
      const theme = page.getByRole('button',{name:'Switch to dark mode',exact:true});
      const themeBox = await theme.boundingBox();
      assert(heading.y<=56,`Excessive top gap at ${width}x${height}`);
      assert(heading.y+heading.height<film.y && film.y+film.height<carousel.y,'Hero order changed');
      assert(Math.abs(carousel.y+carousel.height-hero.y-hero.height)<1,'Carousel is not anchored to the hero bottom');
      const actions = page.getByTestId('hero-actions');
      const actionsBox = await actions.boundingBox();
      assert(film.y-actionsBox.y-actionsBox.height<=28,`Extra space above video at ${width}x${height}`);
      assert(carousel.y-film.y-film.height<=28,`Extra space below video at ${width}x${height}`);
      const actionBoxes = await Promise.all((await actions.locator('a,button').all()).map(b=>b.boundingBox()));
      assert.equal(actionBoxes.length,2);
      assert(Math.abs(actionBoxes[0].y-actionBoxes[1].y)<1,'Hero buttons wrapped to different rows');
      assert(actionBoxes[0].x+actionBoxes[0].width<=actionBoxes[1].x,'Hero buttons overlap');
      for(const action of await actions.locator('a,button').all()) {
        assert(await action.evaluate(el=>el.scrollWidth<=el.clientWidth),'Button text overflows');
        assert.equal(await action.evaluate(el=>getComputedStyle(el).whiteSpace),'nowrap');
      }
      assert.equal(await page.getByTestId('hero-affiliations').evaluate(el=>getComputedStyle(el).position),'static','Carousel should scroll with the hero');
      assert.equal(await page.getByTestId('homepage-hero').locator('p').first().evaluate(el=>getComputedStyle(el).fontSize),'18px');
      assert.equal(await theme.evaluate(el=>getComputedStyle(el).position),'fixed');
      assert(themeBox.width>=44 && themeBox.height>=44,'Theme toggle touch target is too small');
      const headingTextRight = await page.getByRole('heading',{level:1}).evaluate(el=>{
        const range=document.createRange(); range.selectNodeContents(el); return range.getBoundingClientRect().right;
      });
      assert(headingTextRight<themeBox.x || heading.y>=themeBox.y+themeBox.height,'Theme toggle overlaps heading text');
      for (const button of await page.getByTestId('homepage-hero').locator('a,button').all()) {
        assert((await button.boundingBox()).height>=44,'Hero touch target is too small');
      }
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      assert((await video(page)).paused);
      await page.screenshot({path:path.join(output,`homepage-mobile-${width}x${height}.png`),animations:'disabled'});
      const sameWidth = mobileLayouts.find(layout=>layout.width===width);
      if(sameWidth) assert(Math.abs(sameWidth.filmTop-film.y)<1 && Math.abs(sameWidth.carouselTop-carousel.y)<1,'Mobile layout stretches to fill taller screens');
      mobileLayouts.push({width,height,filmTop:film.y,carouselTop:carousel.y,carouselBottom:Math.ceil(carousel.y+carousel.height),shortScreenScrollsNaturally:hero.height>height});
    }
    await page.getByRole('button',{name:'Switch to dark mode',exact:true}).click();
    await page.waitForFunction(()=>document.documentElement.classList.contains('dark'));
    await page.screenshot({path:path.join(output,'homepage-mobile-dark.png'),animations:'disabled'});
    await page.getByRole('button',{name:'Switch to light mode',exact:true}).click();
    await page.waitForFunction(()=>!document.documentElement.classList.contains('dark'));
    report.checks.push({naturalMobileFlow:mobileLayouts,originalMobileType:true,buttonsOnOneLine:true,noExtraVideoSpacing:true,floatingThemeToggleWorks:true,squarePlayOverlay:true});
    await page.setViewportSize({width:1440,height:1000});
    await page.evaluate(()=>window.scrollTo(0,0));
    await page.screenshot({path:path.join(output,'homepage-desktop.png'),animations:'disabled'});
    await page.getByTestId('hero-film-poster').screenshot({path:path.join(output,'thumbnail.png')});

    await playButton(page).focus();
    await page.keyboard.press('Enter');
    await isPlaying(page);
    state = await video(page);
    assert.equal(state.mode,'hls-js');
    assert(!state.muted && !state.loop && state.controls && !state.autoplay && !state.error);
    assert(Math.abs(state.duration-87.72)<.15);
    assert(requests.find(u=>u.endsWith('.m4s')).includes('/360/'));
    assert(!requests.some(u=>u.endsWith('/fallback.mp4')));
    assert.equal(await page.getByTestId('hero-film-poster').count(),0);
    assert.equal(await page.getByRole('button',{name:/^(Play film|Pause film|Mute|Full screen|Watch from start with sound)$/}).count(),0);
    assert.equal(await page.evaluate(()=>document.activeElement.dataset.testid),'hero-film');
    report.checks.push({keyboardActivation:true,startsWithSound:true,singleNativeControlSet:true,startsAt360p:true,playing:state});

    await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
    await page.waitForFunction(()=>document.querySelector('[data-testid="hero-film"]').paused);
    await page.evaluate(()=>window.scrollTo(0,0));
    await delay(500);
    assert((await video(page)).paused,'Film restarted when scrolled back into view');
    await page.getByTestId('hero-film').evaluate(v=>v.play());
    await isPlaying(page);
    await page.getByTestId('hero-film').evaluate(v=>v.pause());
    await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
    await delay(200);
    await page.evaluate(()=>window.scrollTo(0,0));
    await delay(400);
    assert((await video(page)).paused,'Manual pause was lost on scroll');
    await page.getByTestId('hero-film').evaluate(v=>v.play());
    await isPlaying(page);
    await page.getByTestId('hero-film').evaluate(v=>v.currentTime=65);
    await page.waitForFunction(()=>document.querySelector('[data-testid="hero-film"]').currentTime>65.1);
    await page.getByTestId('hero-film').evaluate(v=>v.muted=true);
    assert((await video(page)).muted);
    await page.getByTestId('hero-film').evaluate(v=>v.currentTime=v.duration-.4);
    await page.waitForFunction(()=>document.querySelector('[data-testid="hero-film"]').ended);
    assert((await video(page)).paused);
    report.checks.push({pausesOffscreen:true,neverResumesOnScroll:true,nativeResumeSeekAndMute:true,noLoopAtEnd:true});
    const transcript=await page.request.get(new URL('/video/aisb-hero-v5/transcript.txt',url).href);
    assert((await transcript.text()).includes('Scott Buckley'));
    report.checks.push({noExtraMetadataOrControls:true,sourceCreditPreserved:true});
    await page.close();

    const dark = await pageFor({colorScheme:'dark',viewport:{width:390,height:900}});
    await dark.goto(url,{waitUntil:'domcontentloaded'});
    await dark.getByTestId('hero-film').scrollIntoViewIfNeeded();
    await dark.waitForFunction(()=>document.documentElement.classList.contains('dark'));
    await dark.getByTestId('hero-film').locator('../..').screenshot({path:path.join(output,'film-dark-mobile.png'),animations:'disabled'});
    assert((await video(dark)).paused);
    await dark.close();
    report.checks.push({darkModePoster:true});

    for (const kind of ['reduced-motion','save-data','slow-2g']) {
      const p = await pageFor(kind==='reduced-motion' ? {reducedMotion:'reduce'} : {});
      if(kind!=='reduced-motion') await p.addInitScript(kind => {
        Object.defineProperty(navigator,'connection',{configurable:true,value:{saveData:kind==='save-data',effectiveType:kind==='slow-2g'?'2g':'4g'}});
      },kind);
      const req=[]; p.on('request',r=>{if(mediaRequest(r.url()))req.push(r.url());});
      await p.goto(url,{waitUntil:'domcontentloaded'});
      await p.getByTestId('hero-film').scrollIntoViewIfNeeded();
      await p.waitForFunction(()=>document.querySelector('[data-testid="hero-film"]')?.readyState>=2,null,{timeout:30000});
      assert(req.length>0,kind+' failed to preload');
      assert((await video(p)).paused);
      await playButton(p).click();
      await isPlaying(p);
      report.checks.push({preference:kind,preloadsWithoutAutoplay:true,manualPlayWorks:true});
      await p.close();
    }

    const blocked = await pageFor();
    await blocked.addInitScript(() => {
      const play=HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play=function(){return window.allowTestPlay ? play.call(this) : Promise.reject(new DOMException('Playback blocked','NotAllowedError'));};
    });
    await blocked.goto(url,{waitUntil:'domcontentloaded'});
    await playButton(blocked).click();
    await blocked.waitForFunction(()=>document.querySelector('[data-testid="hero-film"]')?.controls);
    await blocked.waitForFunction(()=>document.querySelector('[data-testid="hero-film"]')?.readyState>=2);
    assert((await video(blocked)).paused);
    assert((await video(blocked)).controls);
    await blocked.evaluate(()=>{window.allowTestPlay=true;return document.querySelector('[data-testid="hero-film"]').play();});
    await isPlaying(blocked);
    report.checks.push({declinedPlayKeepsUsableNativeControls:true});
    await blocked.close();

    const failed = await pageFor();
    await failed.route('**/video/aisb-hero-v5/master.m3u8',r=>r.fulfill({status:404,body:'Not found'}));
    await failed.goto(url,{waitUntil:'domcontentloaded'});
    await playButton(failed).click();
    await isPlaying(failed);
    state=await video(failed);
    assert.equal(state.mode,'mp4');assert.equal(state.height,540);assert(!state.muted);
    report.checks.push({brokenHlsFallsBackToFastStartMp4:true});
    await failed.close();

    const unavailable = await pageFor();
    await unavailable.route('**/video/aisb-hero-v5/**',r=>r.fulfill({status:404,body:'Not found'}));
    await unavailable.goto(url,{waitUntil:'domcontentloaded'});
    await playButton(unavailable).click();
    await unavailable.getByRole('status').filter({hasText:'The video couldn’t load'}).waitFor({timeout:30000});
    assert((await video(unavailable)).paused);
    assert(await unavailable.getByRole('link',{name:'Open the MP4',exact:true}).isVisible());
    report.checks.push({totalMediaFailureHasAccessibleFallback:true});
    await unavailable.close();

    // Exercise the native-HLS error branch; not an actual Safari device test.
    const native = await pageFor();
    await native.addInitScript(() => {
      Object.defineProperty(navigator,'vendor',{configurable:true,value:'Apple Computer, Inc.'});
      const can=HTMLMediaElement.prototype.canPlayType;
      HTMLMediaElement.prototype.canPlayType=function(type){return type==='application/vnd.apple.mpegurl'?'maybe':can.call(this,type);};
    });
    await native.route('**/video/aisb-hero-v5/master.m3u8',r=>r.fulfill({status:404,body:'Not found'}));
    await native.goto(url,{waitUntil:'domcontentloaded'});
    await playButton(native).click();
    await isPlaying(native);
    assert.equal((await video(native)).mode,'mp4');
    report.checks.push({nativeHlsErrorFallsBack:true,nativeSafariDeviceTested:false});
    await native.close();

    if(!process.argv.includes('--skip-adaptive')) {
      // Actual bandwidth adaptation remains intact after opt-in playback.
      const adaptive = await pageFor({deviceScaleFactor:2});
      const segments=[];
      adaptive.on('request',r=>{const m=r.url().match(/\/(360|540|720|1080)\/segment-/);if(m)segments.push({height:Number(m[1]),at:Date.now()});});
      const cdp=await adaptive.context().newCDPSession(adaptive);
      await cdp.send('Network.enable');
      const network=async throughput=>cdp.send('Network.emulateNetworkConditions',{offline:false,latency:50,downloadThroughput:throughput,uploadThroughput:throughput});
      await network(1_250_000);
      await adaptive.goto(url,{waitUntil:'domcontentloaded'});
      await playButton(adaptive).click();
      await isPlaying(adaptive);
      await adaptive.waitForFunction(()=>document.querySelector('[data-testid="hero-film"]').videoHeight>=540,null,{timeout:30000});
      const drop=Date.now();
      await network(100_000);
      await adaptive.waitForFunction(()=>document.querySelector('[data-testid="hero-film"]').videoHeight===360,null,{timeout:45000});
      assert(segments.some(x=>x.height>=540));
      assert(segments.some(x=>x.height===360&&x.at>drop));
      assert(!(await video(adaptive)).error);
      report.checks.push({bandwidthDownshift:true,throttledKbps:800,requestedHeights:segments.map(x=>x.height)});
      await adaptive.close();
    }
    assert.equal(report.errors.length,0,report.errors.join('\n'));
    report.complete=true;
    console.log(JSON.stringify(report,null,2));
  } finally {
    fs.writeFileSync(path.join(output,'browser-qa.json'),JSON.stringify(report,null,2)+'\n');
    for(const context of contexts)await context.close();
    await browser.close();
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
