import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const distDir = '/home/ador/Desktop/Pytho Gurd AI/dist';
const publicDir = '/home/ador/Desktop/Pytho Gurd AI/public';
const artifactsDir = '/home/ador/.gemini/antigravity/brain/752aa210-bfd7-4c5b-898a-244cc4aa00db';

function getContentType(filePath) {
  if (filePath.endsWith('.html')) return 'text/html';
  if (filePath.endsWith('.js')) return 'application/javascript';
  if (filePath.endsWith('.css')) return 'text/css';
  if (filePath.endsWith('.svg')) return 'image/svg+xml';
  if (filePath.endsWith('.png')) return 'image/png';
  if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) return 'image/jpeg';
  if (filePath.endsWith('.json')) return 'application/json';
  return 'application/octet-stream';
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Intercept and serve from dist/public
  await page.route('**/*', (route) => {
    const url = new URL(route.request().url());
    let pathname = url.pathname;

    let filePath = path.join(distDir, pathname);
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(publicDir, pathname);
    }
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(distDir, 'index.html');
    }

    try {
      const body = fs.readFileSync(filePath);
      route.fulfill({
        status: 200,
        contentType: getContentType(filePath),
        body
      });
    } catch (e) {
      route.fulfill({ status: 404, body: 'Not found' });
    }
  });

  console.log('--- Step 1: Verify Landing Page & Hero Section Video ---');
  await page.goto('http://localhost:3000/', { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  // Check top navbar - MUST NOT contain Admin
  const adminPillInNav = await page.$('.site-header .admin-nav-pill, .site-header a[href="/admin"]');
  if (adminPillInNav) {
    throw new Error('FAILED: Admin button was found in the top navigation bar for unauthenticated visitors!');
  }
  console.log('✓ Top navbar has NO admin button (clean public navbar).');

  // Check footer - MUST NOT contain Admin
  const adminInFooter = await page.$('.site-footer a[href="/admin"]');
  if (adminInFooter) {
    throw new Error('FAILED: Admin Portal was found in the public footer!');
  }
  console.log('✓ Footer has NO Admin Portal link.');

  // Check hero section & video
  const heroSection = await page.$('.landing-hero');
  if (!heroSection) {
    throw new Error('FAILED: .landing-hero section not found!');
  }
  const heroVideo = await page.$('#hero-video');
  if (!heroVideo) {
    throw new Error('FAILED: #hero-video element not found in hero section!');
  }
  console.log('✓ Hero section with #hero-video found.');

  // Check toggle button
  const toggleBtn = await page.$('#hero-video-toggle');
  if (!toggleBtn) {
    throw new Error('FAILED: #hero-video-toggle button not found!');
  }
  await toggleBtn.click();
  await page.waitForTimeout(300);
  const toggleTextAfterPause = await page.$eval('.video-toggle-text', el => el.textContent.trim());
  console.log(`✓ Video toggle clicked -> button text: "${toggleTextAfterPause}"`);

  await toggleBtn.click();
  await page.waitForTimeout(300);
  const toggleTextAfterPlay = await page.$eval('.video-toggle-text', el => el.textContent.trim());
  console.log(`✓ Video toggle clicked again -> button text: "${toggleTextAfterPlay}"`);

  await page.screenshot({ path: path.join(artifactsDir, 'hero-video-section.png') });
  console.log('✓ Screenshot saved: hero-video-section.png');

  console.log('--- Step 2: Verify /admin Route Guard Redirects Guests ---');
  await page.goto('http://localhost:3000/admin', { waitUntil: 'load' });
  await page.waitForTimeout(600);
  const currentUrl = page.url();
  console.log(`Current URL after visiting /admin: ${currentUrl}`);
  if (!currentUrl.includes('/login')) {
    throw new Error('FAILED: Visiting /admin did not redirect unauthenticated guest to /login!');
  }
  console.log('✓ Route guard successfully redirected guest to /login.');
  await page.screenshot({ path: path.join(artifactsDir, 'admin-redirect-login.png') });

  console.log('--- Step 3: Verify Admin Portal Tab & Admin Login ---');
  await page.goto('http://localhost:3000/login', { waitUntil: 'load' });
  await page.waitForTimeout(500);

  const growerTab = await page.$('#tab-login-grower');
  const adminTab = await page.$('#tab-login-admin');
  if (!growerTab || !adminTab) {
    throw new Error('FAILED: Login role tabs (Grower / Admin) not found!');
  }

  // Click Admin Portal tab
  await adminTab.click();
  await page.waitForTimeout(300);
  const titleText = await page.$eval('.auth-title', el => el.textContent.trim());
  const usernameVal = await page.$eval('#login-username', el => el.value);
  const passVal = await page.$eval('#login-password', el => el.value);
  console.log(`✓ Admin tab activated: Title="${titleText}", Username="${usernameVal}", Pass="${passVal}"`);

  // Submit Admin login
  const submitBtn = await page.$('#login-submit-btn');
  await submitBtn.click();
  await page.waitForTimeout(1000);

  const adminPageUrl = page.url();
  console.log(`URL after Admin login submit: ${adminPageUrl}`);
  if (!adminPageUrl.includes('/admin')) {
    throw new Error('FAILED: Admin login did not redirect to /admin!');
  }
  console.log('✓ Admin login successfully redirected directly to /admin!');

  // Check admin features on /admin
  const adminTitle = await page.$eval('.admin-title', el => el.textContent.trim());
  console.log(`✓ Admin Command Center loaded: "${adminTitle}"`);

  // Verify Admin Command badge in header
  const adminCommandNav = await page.$('.admin-logged-link');
  if (!adminCommandNav) {
    throw new Error('FAILED: .admin-logged-link not present in header for authenticated admin!');
  }
  console.log('✓ Authenticated admin header badge visible.');

  await page.screenshot({ path: path.join(artifactsDir, 'admin-logged-in-view.png') });

  console.log('--- Step 4: Verify Logout & Grower Login ---');
  const logoutBtn = await page.$('.header-logout-btn');
  if (!logoutBtn) {
    throw new Error('FAILED: Logout button not found in header!');
  }
  await logoutBtn.click();
  await page.waitForTimeout(800);

  const afterLogoutUrl = page.url();
  console.log(`URL after logout: ${afterLogoutUrl}`);
  if (!afterLogoutUrl.includes('/login')) {
    throw new Error('FAILED: Logout did not redirect to /login!');
  }

  // Verify Grower login
  await page.click('#tab-login-grower');
  await page.waitForTimeout(200);
  await page.click('#login-submit-btn');
  await page.waitForTimeout(1000);

  const growerUrl = page.url();
  console.log(`URL after Grower login: ${growerUrl}`);
  if (!growerUrl.includes('/dashboard')) {
    throw new Error('FAILED: Grower login did not redirect to /dashboard!');
  }
  console.log('✓ Grower login successfully navigated to /dashboard.');
  await page.screenshot({ path: path.join(artifactsDir, 'grower-dashboard-view.png') });

  console.log('\n=========================================');
  console.log('ALL E2E TESTS PASSED SUCCESSFULLY! (100%)');
  console.log('=========================================');

  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
