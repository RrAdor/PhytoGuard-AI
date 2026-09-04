// scripts/test-plans-page.mjs
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const artifactsDir = '/home/ador/.gemini/antigravity/brain/392848c6-3813-4edf-bf8b-23bd94aed674';
const distDir = path.resolve(process.cwd(), 'dist');
const publicDir = path.resolve(process.cwd(), 'public');

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.html') return 'text/html';
  if (ext === '.js' || ext === '.mjs') return 'application/javascript';
  if (ext === '.css') return 'text/css';
  if (ext === '.json') return 'application/json';
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.svg') return 'image/svg+xml';
  if (ext === '.tif' || ext === '.tiff') return 'image/tiff';
  if (ext === '.mp4') return 'video/mp4';
  return 'application/octet-stream';
}

async function runTest() {
  console.log('--- Starting Plans Page Verification ---');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  // Route SPA requests against dist
  await page.route('**/*', (route) => {
    const url = new URL(route.request().url());
    let pathname = decodeURIComponent(url.pathname);

    let filePath = path.join(distDir, pathname);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return route.fulfill({
        status: 200,
        contentType: getContentType(filePath),
        body: fs.readFileSync(filePath)
      });
    }

    let pubPath = path.join(publicDir, pathname);
    if (fs.existsSync(pubPath) && fs.statSync(pubPath).isFile()) {
      return route.fulfill({
        status: 200,
        contentType: getContentType(pubPath),
        body: fs.readFileSync(pubPath)
      });
    }

    const indexPath = path.join(distDir, 'index.html');
    return route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: fs.readFileSync(indexPath)
    });
  });

  console.log('[1] Loading /plans page...');
  await page.goto('http://localhost:5173/plans');
  await page.waitForSelector('.plans-grid');

  const planCards = page.locator('.plan-card');
  const count = await planCards.count();
  console.log(`✓ Total plan cards rendered: ${count}`);

  if (count !== 2) {
    throw new Error(`Expected exactly 2 plan cards, got ${count}`);
  }

  const cardTitles = await planCards.locator('.plan-title').allTextContents();
  console.log(`✓ Plan titles: ${JSON.stringify(cardTitles)}`);

  const hasCropIntelligence = await page.locator('text="Crop Intelligence Services"').count();
  const hasDigitalDamage = await page.locator('text="Digital Damage Assessment"').count();
  const hasServiceProviders = await page.locator('text="SERVICE PROVIDERS"').count();
  const hasInsurance = await page.locator('text="INSURANCE"').count();

  console.log(`✓ Verification of deleted sections: Crop Intelligence=${hasCropIntelligence}, Digital Damage=${hasDigitalDamage}, Service Providers=${hasServiceProviders}, Insurance=${hasInsurance}`);

  if (hasCropIntelligence > 0 || hasDigitalDamage > 0 || hasServiceProviders > 0 || hasInsurance > 0) {
    throw new Error('Deleted section still appears on the page!');
  }

  // Desktop English Screenshot
  const desktopEnPath = path.join(artifactsDir, 'plans-page-desktop-en.png');
  await page.screenshot({ path: desktopEnPath, fullPage: true });
  console.log(`✓ Saved desktop screenshot: ${desktopEnPath}`);

  // Test Bangla Toggle
  console.log('[2] Testing Bangla Language Toggle...');
  await page.click('.lang-selector');
  await page.waitForTimeout(200);

  const bnCardTitles = await planCards.locator('.plan-title').allTextContents();
  console.log(`✓ Bangla Plan titles: ${JSON.stringify(bnCardTitles)}`);

  const desktopBnPath = path.join(artifactsDir, 'plans-page-desktop-bn.png');
  await page.screenshot({ path: desktopBnPath, fullPage: true });
  console.log(`✓ Saved Bangla desktop screenshot: ${desktopBnPath}`);

  // Test Mobile Viewport
  console.log('[3] Testing Mobile Viewport (390px)...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(200);

  const mobilePath = path.join(artifactsDir, 'plans-page-mobile.png');
  await page.screenshot({ path: mobilePath, fullPage: true });
  console.log(`✓ Saved mobile screenshot: ${mobilePath}`);

  await browser.close();
  console.log('\n🎉 ALL PLANS PAGE VERIFICATION TESTS PASSED SUCCESSFULLY!');
}

runTest().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});

