import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const artifactsDir = process.env.ARTIFACTS_DIR || '/home/ador/.gemini/antigravity/brain/6bddb615-a7e7-4bcc-9e2f-98866e4091ab';
if (!fs.existsSync(artifactsDir)) fs.mkdirSync(artifactsDir, { recursive: true });
const distDir = path.resolve(process.cwd(), 'dist');

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.html') return 'text/html';
  if (ext === '.js' || ext === '.mjs') return 'application/javascript';
  if (ext === '.css') return 'text/css';
  if (ext === '.json') return 'application/json';
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.svg') return 'image/svg+xml';
  return 'application/octet-stream';
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Route SPA and static files
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

    if (!path.extname(pathname)) {
      const indexPath = path.join(distDir, 'index.html');
      return route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: fs.readFileSync(indexPath)
      });
    }

    return route.continue();
  });

  console.log('--- Step 1: Login as Grower / Standard User & Navigate to Dashboard ---');
  await page.goto('http://localhost:3000/login');
  await page.waitForTimeout(500);

  // Sign in as default demo grower (Ador Chowdhury)
  await page.click('#login-submit-btn');
  await page.waitForTimeout(1000);

  const url = page.url();
  console.log(`Current URL: ${url}`);
  if (!url.includes('/dashboard')) {
    throw new Error(`FAILED: Expected /dashboard, got ${url}`);
  }

  console.log('\n--- Step 2: Verify Monitored Crop Sectors & Disease Recommendations (English) ---');
  const cropRows = await page.$$('.dash-field-row');
  console.log(`✓ Monitored Crop Sectors count: ${cropRows.length} rows`);
  if (cropRows.length !== 6) {
    throw new Error(`FAILED: Expected 6 crop sector rows, found ${cropRows.length}!`);
  }

  // Check recommendation elements
  const recElements = await page.$$('.field-recommendation');
  console.log(`✓ Detected Disease Recommendation count: ${recElements.length} recommendations`);
  if (recElements.length !== 4) {
    throw new Error(`FAILED: Expected 4 recommendations for the 4 detected diseases, found ${recElements.length}!`);
  }

  // Verify Wheat Recommendation
  const wheatRec = await page.$eval('.dash-field-row:nth-child(1) .field-recommendation', el => el.textContent.trim());
  console.log(`Wheat Rec: "${wheatRec}"`);
  if (!wheatRec.includes('Tebuconazole') || !wheatRec.includes('48h')) {
    throw new Error('FAILED: Wheat recommendation missing Tebuconazole fungicide advice!');
  }

  // Verify Tomato Recommendation (Severe / Late Blight)
  const tomatoRec = await page.$eval('.dash-field-row:nth-child(2) .field-recommendation', el => ({
    text: el.textContent.trim(),
    isDanger: el.classList.contains('danger')
  }));
  console.log(`Tomato Rec: "${tomatoRec.text}", isDanger: ${tomatoRec.isDanger}`);
  if (!tomatoRec.isDanger || (!tomatoRec.text.includes('Metalaxyl-M') && !tomatoRec.text.includes('Ridomil'))) {
    throw new Error('FAILED: Tomato Late Blight recommendation missing critical danger class or Ridomil advice!');
  }

  // Verify Soybeans (Clean - No disease recommendation)
  const soybeanRec = await page.$('.dash-field-row:nth-child(3) .field-recommendation');
  if (soybeanRec) {
    throw new Error('FAILED: Clean soybeans row should not have a disease recommendation!');
  }
  console.log('✓ Clean Soybeans row correctly has no disease recommendation alert.');

  // Verify Cucumber Recommendation
  const cucumberRec = await page.$eval('.dash-field-row:nth-child(4) .field-recommendation', el => el.textContent.trim());
  console.log(`Cucumber Rec: "${cucumberRec}"`);
  if (!cucumberRec.includes('Mandipropamid') || !cucumberRec.includes('ventilation')) {
    throw new Error('FAILED: Cucumber Downy Mildew recommendation missing Mandipropamid advice!');
  }

  // Verify Potato Recommendation
  const potatoRec = await page.$eval('.dash-field-row:nth-child(5) .field-recommendation', el => el.textContent.trim());
  console.log(`Potato Rec: "${potatoRec}"`);
  if (!potatoRec.includes('Difenoconazole') || !potatoRec.includes('nitrogen')) {
    throw new Error('FAILED: Potato Early Blight recommendation missing Difenoconazole advice!');
  }

  // Verify Grapevines (Healthy - No disease recommendation)
  const grapevineRec = await page.$('.dash-field-row:nth-child(6) .field-recommendation');
  if (grapevineRec) {
    throw new Error('FAILED: Healthy grapevines row should not have a disease recommendation!');
  }
  console.log('✓ Healthy Grapevines row correctly has no disease recommendation alert.');

  // Take screenshot of desktop sectors
  const sectorsPanel = await page.$('.fields-panel');
  if (sectorsPanel) {
    await sectorsPanel.screenshot({ path: path.join(artifactsDir, 'sectors-recommendations-desktop-en.png') });
    console.log('✓ Saved desktop screenshot: sectors-recommendations-desktop-en.png');
  }

  console.log('\n--- Step 3: Verify Bilingual Support (Bangla) ---');
  // Switch to Bangla
  await page.click('.lang-selector');
  await page.waitForTimeout(600);

  const wheatRecBn = await page.$eval('.dash-field-row:nth-child(1) .field-recommendation', el => el.textContent.trim());
  console.log(`Wheat Rec (BN): "${wheatRecBn}"`);
  if (!wheatRecBn.includes('টেবুকোনাজল') || !wheatRecBn.includes('সুপারিশ')) {
    throw new Error('FAILED: Bangla wheat recommendation translation missing!');
  }

  const tomatoRecBn = await page.$eval('.dash-field-row:nth-child(2) .field-recommendation', el => el.textContent.trim());
  console.log(`Tomato Rec (BN): "${tomatoRecBn}"`);
  if (!tomatoRecBn.includes('রিডোমিল') && !tomatoRecBn.includes('মেটালাক্সিল')) {
    throw new Error('FAILED: Bangla tomato recommendation translation missing!');
  }

  const sectorsPanelBn = await page.$('.fields-panel');
  if (sectorsPanelBn) {
    await sectorsPanelBn.screenshot({ path: path.join(artifactsDir, 'sectors-recommendations-desktop-bn.png') });
    console.log('✓ Saved desktop Bangla screenshot: sectors-recommendations-desktop-bn.png');
  }

  // Switch back to English
  await page.click('.lang-selector');
  await page.waitForTimeout(400);

  console.log('\n--- Step 4: Verify Mobile Responsive Layout (390px) ---');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  if (overflow) {
    throw new Error('FAILED: Horizontal overflow detected on mobile viewport 390px!');
  }
  console.log('✓ Mobile viewport (390px) verified: Zero horizontal overflow.');

  await page.screenshot({ path: path.join(artifactsDir, 'sectors-recommendations-mobile.png'), fullPage: false });
  console.log('✓ Saved mobile screenshot: sectors-recommendations-mobile.png');

  // Full page desktop screenshot
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(artifactsDir, 'dashboard-sectors-full.png'), fullPage: true });
  console.log('✓ Saved full dashboard screenshot: dashboard-sectors-full.png');

  console.log('\n======================================================');
  console.log('ALL MONITORED SECTOR RECOMMENDATION TESTS PASSED! (100%)');
  console.log('======================================================');

  await browser.close();
}

run().catch((err) => {
  console.error('\nTEST FAILED:', err);
  process.exit(1);
});
