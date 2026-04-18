#!/usr/bin/env node
/**
 * Slide deck / magazine -> per-slide PNG exporter.
 *
 * Renders each .slide / .page in an HTML deck as its own fixed-canvas PNG
 * (1920x1080 by default, 1080x1920 for portrait). Writes one file per slide
 * into the output directory, zero-padded and numbered so tools that list the
 * directory get them in order.
 *
 * Mirrors the print-prep logic of export-slides-pdf.mjs:
 *   - serves the patched HTML over a throwaway HTTP server so Chromium can
 *     execute scripts (Chart.js canvas -> img swap) and resolve sibling assets
 *   - collapses scroll-snap so each slide occupies the full canvas
 *   - forces flex-centered Mermaid wrappers to fill their container
 *   - suppresses fixed chrome (theme toggle, deck nav, progress bars)
 *
 * Usage:
 *   node export-slides-png.mjs <input.html> <outputDir> [options]
 *
 * Options:
 *   --mode=slides|magazine           Default: auto-detect from the DOM.
 *                                    slides   -> one .slide per image
 *                                    magazine -> one .page per image
 *   --orientation=landscape|portrait Default: landscape.
 *   --width=<px>  --height=<px>      Canvas dimensions. Default 1920x1080
 *                                    landscape or 1080x1920 portrait.
 *   --selector=<css>                 Override per-slide selector.
 *   --prefix=<str>                   Filename prefix. Default: "slide".
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error(`\nexport-slides-png.mjs: playwright is not installed.

Install it in the current directory (or any ancestor where Node can resolve it):

  npm install playwright
  npx playwright install chromium

Then re-run this command.\n`);
  process.exit(1);
}

const args = process.argv.slice(2);
const positional = args.filter(a => !a.startsWith('--'));
const flags = Object.fromEntries(
  args.filter(a => a.startsWith('--')).map(a => {
    const eq = a.indexOf('=');
    return eq === -1 ? [a.slice(2), true] : [a.slice(2, eq), a.slice(eq + 1)];
  })
);

const inputHtml = positional[0];
const outputDir = positional[1];

if (!inputHtml || !outputDir) {
  console.error('Usage: export-slides-png.mjs <input.html> <outputDir> [--mode=slides|magazine] [--orientation=landscape|portrait] [--width=N --height=N] [--selector=CSS] [--prefix=slide]');
  process.exit(1);
}

const absInput = path.resolve(inputHtml);
const absOutputDir = path.resolve(outputDir);

if (!fs.existsSync(absInput)) {
  console.error(`Input not found: ${absInput}`);
  process.exit(1);
}

fs.mkdirSync(absOutputDir, { recursive: true });

let htmlContent = fs.readFileSync(absInput, 'utf-8');
const inputDir = path.dirname(absInput);

let mode = flags.mode;
if (!mode) {
  if (htmlContent.includes('scroll-snap-type: x')) mode = 'magazine';
  else if (/class="[^"]*\bslide\b/.test(htmlContent) || htmlContent.includes("class='slide'")) mode = 'slides';
  else mode = 'slides';
}

const defaultSelector = { slides: '.slide', magazine: '.page' }[mode] || '.slide';
const perPageSelector = flags.selector || defaultSelector;
const orientation = flags.orientation || 'landscape';
const pageWidth = Number(flags.width) || (orientation === 'landscape' ? 1920 : 1080);
const pageHeight = Number(flags.height) || (orientation === 'landscape' ? 1080 : 1920);
const prefix = flags.prefix || 'slide';

const chartFixScript = `
<script>
window.addEventListener('load', function() {
  setTimeout(function() {
    document.querySelectorAll('canvas').forEach(function(canvas) {
      try {
        var img = new Image();
        img.src = canvas.toDataURL('image/png');
        img.style.width = canvas.style.width || canvas.width + 'px';
        img.style.height = canvas.style.height || canvas.height + 'px';
        img.style.maxWidth = '100%';
        canvas.parentNode.replaceChild(img, canvas);
      } catch (e) { /* tainted canvas */ }
    });
    document.body.setAttribute('data-png-ready', 'true');
  }, 1200);
});
</script>`;

htmlContent = htmlContent.replace('</body>', `${chartFixScript}\n</body>`);

const port = 9970 + Math.floor(Math.random() * 100);
const server = http.createServer((req, res) => {
  const url = req.url === '/' ? '/index.html' : req.url;
  if (url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(htmlContent);
    return;
  }
  const assetPath = path.join(inputDir, decodeURIComponent(url.split('?')[0]));
  if (!assetPath.startsWith(inputDir) || !fs.existsSync(assetPath)) {
    res.writeHead(404);
    res.end('not found');
    return;
  }
  const ext = path.extname(assetPath).toLowerCase();
  const ct = {
    '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg',
    '.gif':'image/gif', '.webp':'image/webp', '.svg':'image/svg+xml',
    '.woff':'font/woff', '.woff2':'font/woff2', '.ttf':'font/ttf',
    '.css':'text/css', '.js':'application/javascript',
    '.webm':'video/webm', '.mp4':'video/mp4'
  }[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': ct });
  fs.createReadStream(assetPath).pipe(res);
});
await new Promise(resolve => server.listen(port, resolve));

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: pageWidth, height: pageHeight },
  deviceScaleFactor: 2,
});
const page = await context.newPage();

try {
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle', timeout: 20000 });
} catch (err) {
  console.error(`Navigation failed: ${err.message}`);
  await browser.close();
  server.close();
  process.exit(1);
}

try {
  await page.waitForSelector('[data-png-ready="true"]', { timeout: 6000 });
} catch {
  // No canvases, fine.
}

await page.evaluate(({ selector, pageWidth, pageHeight }) => {
  const slides = Array.from(document.querySelectorAll(selector));
  slides.forEach(s => {
    s.style.setProperty('width',  pageWidth  + 'px', 'important');
    s.style.setProperty('height', pageHeight + 'px', 'important');
    s.style.setProperty('min-height', pageHeight + 'px', 'important');
    s.style.setProperty('max-height', pageHeight + 'px', 'important');
    s.style.setProperty('overflow', 'hidden', 'important');
    s.style.setProperty('scroll-snap-align', 'none', 'important');
  });

  document.querySelectorAll('.mermaid-wrap').forEach(wrap => {
    wrap.style.setProperty('overflow', 'hidden', 'important');
    const mer = wrap.querySelector('.mermaid');
    if (mer) {
      mer.style.setProperty('width', '100%', 'important');
      mer.style.setProperty('height', '100%', 'important');
      mer.style.setProperty('transform', 'none', 'important');
      mer.style.setProperty('display', 'flex', 'important');
      mer.style.setProperty('align-items', 'center', 'important');
      mer.style.setProperty('justify-content', 'center', 'important');
    }
    wrap.querySelectorAll('svg').forEach(svg => {
      svg.removeAttribute('width');
      svg.removeAttribute('height');
      svg.style.setProperty('width', '100%', 'important');
      svg.style.setProperty('height', '100%', 'important');
      svg.style.setProperty('max-width', '100%', 'important');
      svg.style.setProperty('max-height', '100%', 'important');
    });
  });

  const chromeSelectors = [
    '.theme-toggle', '.deck-progress', '.deck-dots', '.deck-nav',
    '.mag-nav', '.mag-nav__dots', '.mag-counter',
    '.slide__progress', '.slide-counter', '.slide-index',
    '.zoom-controls', '.diagram-shell__hint'
  ];
  document.querySelectorAll(chromeSelectors.join(',')).forEach(el => {
    el.style.setProperty('display', 'none', 'important');
  });
}, { selector: perPageSelector, pageWidth, pageHeight });

const slides = await page.$$(perPageSelector);
if (slides.length === 0) {
  console.error(`No elements matched selector "${perPageSelector}" — check --selector or --mode.`);
  await browser.close();
  server.close();
  process.exit(1);
}

const pad = String(slides.length).length;
const written = [];
for (let i = 0; i < slides.length; i++) {
  const num = String(i + 1).padStart(pad, '0');
  const outPath = path.join(absOutputDir, `${prefix}-${num}.png`);
  await slides[i].screenshot({ path: outPath, type: 'png', omitBackground: false });
  written.push(outPath);
}

await browser.close();
server.close();

for (const p of written) console.log(p);
console.log(`Exported ${written.length} slide(s) to ${absOutputDir} (mode=${mode}, ${pageWidth}x${pageHeight})`);
