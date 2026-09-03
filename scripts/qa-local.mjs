import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const baseUrl = process.env.CLONE_URL || 'http://localhost:5174';
const outDir = path.resolve('qa');
const widths = [1440, 768, 390];
const routes = [
  ['/', 'Built for every link in the crop value chain'],
  ['/crops', 'Built for the crops that feed the world'],
  ['/crops/potato', 'Potatoes'],
  ['/crops/corn', 'Corn'],
  ['/crops/sugarcane', 'Sugarcane'],
  ['/crops/tomato', 'Tomatoes'],
  ['/crops/onion', 'Onions'],
  ['/crops/cotton', 'Cotton'],
  ['/crops/soybeans', 'Soybeans'],
  ['/crops/sugar-beet', 'Sugar beet'],
  ['/crops/all', 'Field-wide tools, every crop'],
  ['/how-it-works', 'All the insights you need in one platform.'],
  ['/plans', 'Built for every link in the crop value chain'],
];

function slug(route) {
  return (route === '/' ? 'home' : route.replace(/^\/+/, '').replace(/[^a-z0-9]+/gi, '-')).toLowerCase();
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const results = [];

  for (const width of widths) {
    const page = await context.newPage();
    await page.setViewportSize({ width, height: 950 });
    for (const [route, expectedHeading] of routes) {
      await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(350);
      const h1 = await page.locator('h1').first().innerText();
      const metrics = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        bodyTextLength: document.body.innerText.length,
        imageCount: document.images.length,
        brokenImages: [...document.images].filter((img) => img.complete && img.naturalWidth === 0).map((img) => img.src),
      }));
      const okHeading = h1.trim() === expectedHeading;
      const okOverflow = metrics.scrollWidth <= metrics.clientWidth + 1;
      const okImages = metrics.brokenImages.length === 0;
      const screenshot = path.join(outDir, `${slug(route)}-${width}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });
      results.push({ route, width, h1, okHeading, okOverflow, okImages, ...metrics, screenshot });
    }
    await page.close();
  }

  await browser.close();
  await writeFile(path.join(outDir, 'local-qa.json'), JSON.stringify(results, null, 2));

  const failed = results.filter((r) => !r.okHeading || !r.okOverflow || !r.okImages || r.bodyTextLength < 80);
  console.table(results.map((r) => ({
    route: r.route,
    width: r.width,
    heading: r.okHeading,
    overflow: r.okOverflow,
    images: r.okImages,
  })));
  if (failed.length) {
    console.error(JSON.stringify(failed, null, 2));
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
