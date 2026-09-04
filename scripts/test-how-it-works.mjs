// scripts/test-how-it-works.mjs
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
  console.log('--- Starting How It Works Page Verification ---');

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

  console.log('[1] Loading /how-it-works page...');
  await page.goto('http://localhost:5173/how-it-works');
  await page.waitForSelector('.hiw-page-wrap');

  // Verify deletion of ecosystem section
  const hasCompatibleAircraft = await page.locator('text="Compatible with the aircraft you already own"').count();
  const hasHardwareAgnostic = await page.locator('text="Hardware Agnostic"').count();
  const hasFlightPlanners = await page.locator('text="Automated Flight Planners"').count();
  const hasCommonQuestions = await page.locator('text="Common questions"').count();
  const hasFaqCards = await page.locator('.hiw-faq-card').count();
  const hasEcosystemCard = await page.locator('.hiw-ecosystem-card').count();

  console.log(`✓ Verification of removed sections:`);
  console.log(`  - Compatible with aircraft: ${hasCompatibleAircraft}`);
  console.log(`  - Hardware Agnostic: ${hasHardwareAgnostic}`);
  console.log(`  - Automated Flight Planners: ${hasFlightPlanners}`);
  console.log(`  - Common questions: ${hasCommonQuestions}`);
  console.log(`  - FAQ card elements: ${hasFaqCards}`);
  console.log(`  - Ecosystem card elements: ${hasEcosystemCard}`);

  if (hasCompatibleAircraft > 0 || hasHardwareAgnostic > 0 || hasFlightPlanners > 0 || hasCommonQuestions > 0 || hasFaqCards > 0 || hasEcosystemCard > 0) {
    throw new Error('Sections that should have been removed still exist on /how-it-works!');
  }

  // Verify that remaining sections are intact
  const hasHeader = await page.locator('.hiw-header-section').isVisible();
  const hasTelemetry = await page.locator('.hiw-telemetry-card').isVisible();
  const hasFlows = await page.locator('.hiw-flows-section').isVisible();
  const hasPipeline = await page.locator('.hiw-pipeline-section').isVisible();
  const hasDelivery = await page.locator('.hiw-delivery-section').isVisible();
  const hasBottomBanner = await page.locator('.hiw-bottom-banner-section').isVisible();

  console.log(`✓ Retained sections present:`);
  console.log(`  - Header: ${hasHeader}`);
  console.log(`  - Telemetry: ${hasTelemetry}`);
  console.log(`  - Core Flows: ${hasFlows}`);
  console.log(`  - Pipeline (4 phases): ${hasPipeline}`);
  console.log(`  - Delivery cards: ${hasDelivery}`);
  console.log(`  - Bottom Demo Banner: ${hasBottomBanner}`);

  if (!hasHeader || !hasTelemetry || !hasFlows || !hasPipeline || !hasDelivery || !hasBottomBanner) {
    throw new Error('Some core sections of /how-it-works are missing!');
  }

  // Capture Desktop English Screenshot
  const desktopEnPath = path.join(artifactsDir, 'how-it-works-desktop-en.png');
  await page.screenshot({ path: desktopEnPath, fullPage: true });
  console.log(`✓ Saved desktop screenshot: ${desktopEnPath}`);

  // Test Bangla Toggle
  console.log('[2] Testing Bangla Language Toggle...');
  await page.click('.lang-selector');
  await page.waitForTimeout(200);

  const desktopBnPath = path.join(artifactsDir, 'how-it-works-desktop-bn.png');
  await page.screenshot({ path: desktopBnPath, fullPage: true });
  console.log(`✓ Saved Bangla desktop screenshot: ${desktopBnPath}`);

  // Test Mobile Viewport
  console.log('[3] Testing Mobile Viewport (390px)...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(200);

  const mobilePath = path.join(artifactsDir, 'how-it-works-mobile.png');
  await page.screenshot({ path: mobilePath, fullPage: true });
  console.log(`✓ Saved mobile screenshot: ${mobilePath}`);

  await browser.close();
  console.log('\n🎉 ALL HOW-IT-WORKS VERIFICATION TESTS PASSED SUCCESSFULLY!');
}

runTest().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});

