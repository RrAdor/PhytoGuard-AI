// scripts/test-farmers-card.mjs
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
  console.log('--- Starting Farmers Card Authentication & Privacy Verification ---');

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

  // STEP 1: Unauthenticated Navigation Check
  console.log('\n[1] Testing Unauthenticated Visitor Navigation...');
  await page.goto('http://localhost:5173/');
  await page.waitForSelector('.main-nav');

  const loggedOutNav = page.locator('.main-nav a[href*="farmers-card"]');
  const loggedOutNavHref = await loggedOutNav.getAttribute('href');
  console.log(`✓ Logged-out navbar link points to: "${loggedOutNavHref}"`);
  if (!loggedOutNavHref.includes('/login?redirect=/farmers-card')) {
    throw new Error(`Expected navbar to direct unauthenticated users to login with redirect! Got: ${loggedOutNavHref}`);
  }

  // Direct visit to /farmers-card while logged out
  console.log('[2] Testing Direct Access to /farmers-card when logged out...');
  await page.goto('http://localhost:5173/farmers-card');
  await page.waitForURL('**/login?redirect=/farmers-card');
  const currentUrl = page.url();
  console.log(`✓ Successfully redirected unauthenticated visitor to: ${currentUrl}`);
  if (!currentUrl.includes('/login?redirect=/farmers-card')) {
    throw new Error(`Direct visit to /farmers-card was not guarded! URL: ${currentUrl}`);
  }

  // STEP 2: Authenticate as Ador (ador@phytoguard.ai)
  console.log('\n[3] Logging in as Ador (ador@phytoguard.ai)...');
  await page.waitForSelector('#login-form');
  await page.fill('#login-username', 'ador@phytoguard.ai');
  await page.fill('#login-password', 'password123');
  await page.click('#login-form button[type="submit"]');

  // Should automatically redirect to /farmers-card
  await page.waitForURL('**/farmers-card');
  console.log(`✓ Successfully logged in and redirected to: ${page.url()}`);

  // Verify page title and header
  const title = await page.title();
  console.log(`✓ Document title: "${title}"`);
  if (!title.includes('Farmers Card')) {
    throw new Error(`Unexpected page title: ${title}`);
  }

  // STEP 3: Verify Privacy - Ador sees ONLY Ador's card
  console.log('\n[4] Verifying User Card Privacy & Directory Filtering for Ador...');
  const previewName = (await page.locator('#preview-farmer-name').textContent()).trim();
  const previewCard = (await page.locator('#preview-card-number').textContent()).trim();
  const previewLocation = (await page.locator('#preview-location').textContent()).trim();
  const previewCrop = (await page.locator('#preview-crop').textContent()).trim();
  console.log(`✓ Featured Smart Card: Holder="${previewName}", Card="${previewCard}", Loc="${previewLocation}", Crop="${previewCrop}"`);

  if (!previewName.includes('Ador') || !previewCard.includes('KRC-BD-2026-88017')) {
    throw new Error(`Featured card does not belong to Ador! Got: ${previewName}`);
  }

  // Verify directory contains ONLY Ador's card (1 card)
  const gridCards = page.locator('.farmer-grid-card');
  const cardCount = await gridCards.count();
  console.log(`✓ Registered cards visible to Ador: ${cardCount}`);
  if (cardCount !== 1) {
    throw new Error(`Privacy violation! Ador should see only 1 card, but sees ${cardCount}`);
  }

  const gridFarmerName = (await gridCards.first().locator('.farmer-name-title').textContent()).trim();
  console.log(`✓ Visible card in directory: "${gridFarmerName}"`);
  if (!gridFarmerName.includes('Ador')) {
    throw new Error(`Visible card does not belong to Ador! Got: ${gridFarmerName}`);
  }

  // Verify other farmers' cards are NOT visible
  const rafiqulMatches = await page.locator('.farmer-grid-card:has-text("Md. Rafiqul Islam")').count();
  const shamimMatches = await page.locator('.farmer-grid-card:has-text("Shamim Al Mamun")').count();
  const nurulMatches = await page.locator('.farmer-grid-card:has-text("Nurul Huda")').count();

  console.log(`✓ Verification of other farmers cards: Rafiqul=${rafiqulMatches}, Shamim=${shamimMatches}, Nurul=${nurulMatches}`);
  if (rafiqulMatches > 0 || shamimMatches > 0 || nurulMatches > 0) {
    throw new Error('Privacy breach! Cards of other users are visible in directory!');
  }

  // Verify stats strip shows Ador's acreage
  const statFarmers = (await page.locator('#stats-total-farmers').textContent()).trim();
  const statAcreage = (await page.locator('#stats-total-acreage').textContent()).trim();
  console.log(`✓ Ador's Stats: Total Farmers=${statFarmers}, Total Acreage=${statAcreage}`);
  if (statFarmers !== '1' || !statAcreage.includes('40')) {
    throw new Error(`Stats banner inaccurate for Ador! Farmers: ${statFarmers}, Acreage: ${statAcreage}`);
  }

  // STEP 4: Add another card for Ador
  console.log('\n[5] Registering a second card for Ador...');
  await page.click('#open-add-card-btn-hero');
  await page.waitForTimeout(200);

  // Check prefill
  const namePrefill = await page.locator('#farmer-name-input').inputValue();
  console.log(`✓ Form name input prefilled with: "${namePrefill}"`);
  if (!namePrefill.includes('Ador')) {
    throw new Error(`Expected form name to prefill with "Ador", got "${namePrefill}"`);
  }

  await page.click('#generate-card-id-btn');
  const genCardId = await page.locator('#farmer-card-number-input').inputValue();
  await page.fill('#farmer-district-input', 'Pabna');
  await page.fill('#farmer-upazila-input', 'Ishwardi');
  await page.fill('#farmer-field-size-input', '25 Hectares');
  await page.selectOption('#farmer-crop-select', 'Wheat');
  await page.selectOption('#farmer-category-select', 'Commercial Grower');
  await page.click('#save-farmer-card-btn');
  await page.waitForTimeout(300);

  // Ador now has 2 cards
  const adorNewCardCount = await page.locator('.farmer-grid-card').count();
  console.log(`✓ Cards visible to Ador after adding second card: ${adorNewCardCount}`);
  if (adorNewCardCount !== 2) {
    throw new Error(`Expected 2 cards for Ador, got ${adorNewCardCount}`);
  }

  // Total acreage should be 40 + 25 = 65
  const newStatAcreage = (await page.locator('#stats-total-acreage').textContent()).trim();
  console.log(`✓ Updated total acreage: ${newStatAcreage}`);
  if (!newStatAcreage.includes('65')) {
    throw new Error(`Expected total acreage to be 65 Ha, got: ${newStatAcreage}`);
  }

  // Capture Desktop Screenshot
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
  const desktopScreenshot = path.join(artifactsDir, 'farmers-card-desktop-en.png');
  await page.screenshot({ path: desktopScreenshot, fullPage: true });
  console.log(`✓ Saved desktop screenshot: ${desktopScreenshot}`);

  // STEP 5: Bilingual Switch (Bangla)
  console.log('\n[6] Testing Bilingual Switch to Bangla (বাংলা)...');
  await page.click('.lang-selector');
  await page.waitForTimeout(200);

  const bnTitle = await page.title();
  const bnNavText = (await page.locator('.main-nav a[href="/farmers-card"]').textContent()).trim();
  const bnHectl = (await page.locator('.farmers-main-title').textContent()).trim();
  const bnDirectoryTitle = (await page.locator('.farmers-directory-section .section-heading').textContent()).trim();

  console.log(`✓ Bangla Document Title: "${bnTitle}"`);
  console.log(`✓ Bangla Nav Link: "${bnNavText}"`);
  console.log(`✓ Bangla Hero Title: "${bnHectl}"`);
  console.log(`✓ Bangla Directory Title: "${bnDirectoryTitle}"`);

  if (!bnNavText.includes('কৃষক কার্ড') || !bnDirectoryTitle.includes('নিবন্ধিত')) {
    throw new Error('Bangla translation missing or incomplete on Farmers Card page!');
  }

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
  const bnScreenshot = path.join(artifactsDir, 'farmers-card-desktop-bn.png');
  await page.screenshot({ path: bnScreenshot, fullPage: true });
  console.log(`✓ Saved Bangla screenshot: ${bnScreenshot}`);

  // STEP 6: Mobile Viewport Verification
  console.log('\n[7] Testing Mobile Viewport (390px)...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);

  const mobileScreenshot = path.join(artifactsDir, 'farmers-card-mobile.png');
  await page.screenshot({ path: mobileScreenshot, fullPage: true });
  console.log(`✓ Saved mobile screenshot: ${mobileScreenshot}`);

  // STEP 7: Switch user to test isolation for a fresh user
  console.log('\n[8] Testing Fresh User (0 cards) Empty State...');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => {
    localStorage.removeItem('phyto_current_user');
    // Set a new user session with no cards
    localStorage.setItem('phyto_current_user', JSON.stringify({
      name: 'Tariqul Alam',
      firstName: 'Tariqul',
      lastName: 'Alam',
      email: 'tariqul@demo-farm.bd',
      phone: '+880 1911-223344',
      role: 'grower'
    }));
  });

  await page.goto('http://localhost:5173/farmers-card');
  await page.waitForSelector('.farmers-card-page-wrap');

  const tariqulCardsCount = await page.locator('.farmer-grid-card').count();
  console.log(`✓ Cards visible to Tariqul (fresh account): ${tariqulCardsCount}`);
  if (tariqulCardsCount !== 0) {
    throw new Error(`Fresh user should have 0 cards, but saw ${tariqulCardsCount}`);
  }

  const emptyStateVisible = await page.locator('#farmer-cards-empty').isVisible();
  const emptyStateTitle = (await page.locator('#farmer-cards-empty .empty-title').textContent()).trim();
  console.log(`✓ Empty state visible: ${emptyStateVisible}, Title: "${emptyStateTitle}"`);
  if (!emptyStateVisible) {
    throw new Error('Empty state not visible for user with 0 cards!');
  }

  await browser.close();
  console.log('\n🎉 ALL FARMERS CARD AUTHENTICATION & PRIVACY TESTS PASSED SUCCESSFULLY!');
}

runTest().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
