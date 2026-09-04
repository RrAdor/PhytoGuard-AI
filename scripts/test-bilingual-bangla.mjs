// scripts/test-bilingual-bangla.mjs
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const artifactsDir = '/home/ador/.gemini/antigravity/brain/f7739f2a-b6cc-40fd-9e5c-643d19c29274';
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

async function main() {
  console.log('--- Starting Bilingual English & Bangla Automated Tests ---');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
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

  try {
    // 1. Visit Landing Page in default English
    console.log('\n--- Step 1: Default English Landing Page ---');
    await page.goto('http://localhost:3000/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForSelector('.lang-selector');

    const defaultLangText = await page.locator('.lang-selector span').textContent();
    console.log('Default lang selector text:', defaultLangText.trim());
    if (defaultLangText.trim() !== 'EN') {
      throw new Error(`Expected EN default but got ${defaultLangText}`);
    }

    const enNavLinks = await page.locator('.main-nav a').allTextContents();
    console.log('English Nav Links:', enNavLinks.map(s => s.trim()));

    // 2. Click Language Selector to switch to Bangla
    console.log('\n--- Step 2: Toggle to Bangla (বাংলা) ---');
    await page.click('.lang-selector');
    await page.waitForTimeout(400);

    const bnLangText = await page.locator('.lang-selector span').textContent();
    console.log('Updated lang selector text:', bnLangText.trim());
    if (bnLangText.trim() !== 'বাংলা') {
      throw new Error(`Expected বাংলা but got ${bnLangText}`);
    }

    const bnNavLinks = await page.locator('.main-nav a').allTextContents();
    console.log('Bangla Nav Links:', bnNavLinks.map(s => s.trim()));
    if (!bnNavLinks.some(l => l.includes('ড্যাশবোর্ড') || l.includes('প্রধান ফসল'))) {
      throw new Error('Bangla nav links not rendered correctly');
    }

    const heroTitle = await page.locator('.hero-title').innerHTML();
    console.log('Bangla Hero Title:', heroTitle.replace(/\s+/g, ' ').trim());
    if (!heroTitle.includes('পাতার স্তরে')) {
      throw new Error('Bangla hero title does not contain "পাতার স্তরে"');
    }

    const heroCta = await page.locator('.hero-cta-btn').textContent();
    console.log('Bangla Hero CTA:', heroCta.trim());
    if (!heroCta.includes('ফ্রি ডেমো শুরু করুন')) {
      throw new Error('Bangla hero CTA does not contain "ফ্রি ডেমো শুরু করুন"');
    }

    await page.screenshot({
      path: path.join(artifactsDir, 'bangla-landing-hero.png'),
      fullPage: false
    });
    console.log('✓ Captured bangla-landing-hero.png');

    // 3. Test Main Crops Page in Bangla
    console.log('\n--- Step 3: Main Crops Page in Bangla ---');
    await page.click('a[href="/crops"]');
    await page.waitForSelector('.crops-grid');

    const cropsMainTitle = await page.locator('.crops-main-title').textContent();
    console.log('Bangla Crops Main Title:', cropsMainTitle.trim());

    const cropCards = await page.locator('.crop-card-title').allTextContents();
    console.log('Bangla Crop Cards (first 6):', cropCards.slice(0, 6));
    if (!cropCards.includes('গম') || !cropCards.includes('টমেটো')) {
      throw new Error('Crop names গম or টমেটো missing from Bangla crops page');
    }

    await page.screenshot({
      path: path.join(artifactsDir, 'bangla-crops-page.png'),
      fullPage: false
    });
    console.log('✓ Captured bangla-crops-page.png');

    // 4. Test Grower / User Dashboard in Bangla
    console.log('\n--- Step 4: Grower Dashboard in Bangla ---');
    // Login as grower
    await page.goto('http://localhost:3000/login');
    await page.waitForSelector('#login-form');

    const welcomeTitle = await page.locator('.auth-title').textContent();
    console.log('Bangla Login Welcome Title:', welcomeTitle.trim());

    await page.click('#login-submit-btn');
    await page.waitForURL('**/dashboard');
    await page.waitForSelector('.dash-greeting');

    const greeting = await page.locator('.dash-greeting').textContent();
    console.log('Bangla Grower Greeting:', greeting.trim());
    if (!greeting.includes('স্বাগতম')) {
      throw new Error('Grower greeting does not contain "স্বাগতম"');
    }

    const exportBtnText = await page.locator('.dash-export-btn span').textContent();
    const flightBtnText = await page.locator('.dash-flight-btn span:last-child').textContent();
    console.log('1st Button (Export):', exportBtnText.trim());
    console.log('2nd Button (Flight):', flightBtnText.trim());
    if (!exportBtnText.includes('রিপোর্ট এক্সপোর্ট') || !flightBtnText.includes('ড্রোন মিশন প্ল্যান')) {
      throw new Error('Dashboard buttons do not have Bangla translations');
    }

    const kpiLabels = await page.locator('.dash-metric-card .metric-label').allTextContents();
    console.log('Bangla KPI Labels:', kpiLabels);

    await page.screenshot({
      path: path.join(artifactsDir, 'bangla-grower-dashboard.png'),
      fullPage: false
    });
    console.log('✓ Captured bangla-grower-dashboard.png');

    // 5. Test Admin Dashboard in Bangla
    console.log('\n--- Step 5: Admin Dashboard in Bangla ---');
    // Logout and login as admin
    await page.click('.header-logout-btn');
    await page.waitForURL('**/login');

    await page.click('#tab-login-admin');
    await page.waitForTimeout(200);

    const adminGatewayTitle = await page.locator('.auth-title').textContent();
    console.log('Bangla Admin Gateway Title:', adminGatewayTitle.trim());

    await page.click('#login-submit-btn');
    await page.waitForURL('**/dashboard');
    await page.waitForSelector('.admin-title');

    const adminBadge = await page.locator('.admin-header-badge').textContent();
    console.log('Bangla Admin Header Badge:', adminBadge.trim());

    const adminTitle = await page.locator('.admin-title').textContent();
    console.log('Bangla Admin Title:', adminTitle.trim());

    const tableHeaders = await page.locator('.admin-requests-table th').allTextContents();
    console.log('Bangla Table Headers:', tableHeaders);

    const approveBtnText = await page.locator('.btn-approve-request span').first().textContent();
    console.log('Bangla Action Button:', approveBtnText.trim());

    await page.screenshot({
      path: path.join(artifactsDir, 'bangla-admin-dashboard.png'),
      fullPage: false
    });
    console.log('✓ Captured bangla-admin-dashboard.png');

    // 6. Toggle back to English
    console.log('\n--- Step 6: Toggle back to English ---');
    await page.click('.lang-selector');
    await page.waitForTimeout(300);

    const restoredLang = await page.locator('.lang-selector span').textContent();
    console.log('Restored lang selector:', restoredLang.trim());
    if (restoredLang.trim() !== 'EN') {
      throw new Error(`Expected EN after toggle back but got ${restoredLang}`);
    }

    const restoredAdminTitle = await page.locator('.admin-title').textContent();
    console.log('Restored English Admin Title:', restoredAdminTitle.trim());

    console.log('\n======================================================');
    console.log('ALL BILINGUAL BANGLA TRANSLATION TESTS PASSED (100%)');
    console.log('======================================================');
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
