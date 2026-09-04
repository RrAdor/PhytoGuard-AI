import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const artifactsDir = '/home/ador/.gemini/antigravity/brain/752aa210-bfd7-4c5b-898a-244cc4aa00db';
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

  console.log('--- Step 1: Login as Admin and Verify Redirection to User Dashboard ---');
  await page.goto('http://localhost:3000/login');
  await page.waitForTimeout(500);

  // Switch to Admin tab
  await page.click('#tab-login-admin');
  await page.waitForTimeout(200);

  // Submit Admin Login
  await page.click('#login-submit-btn');
  await page.waitForTimeout(1000);

  const currentUrl = page.url();
  console.log(`Current URL after Admin login: ${currentUrl}`);
  if (!currentUrl.includes('/dashboard')) {
    throw new Error(`FAILED: Admin login redirected to ${currentUrl} instead of /dashboard!`);
  }
  console.log('✓ Admin login routed directly to /dashboard.');

  // Check that Admin User Switcher Bar exists
  const switcherBar = await page.$('.admin-user-switcher-bar');
  if (!switcherBar) {
    throw new Error('FAILED: .admin-user-switcher-bar not found on dashboard for Admin!');
  }
  console.log('✓ Admin User Switcher Bar is active.');

  // Verify Single-Line Welcome for Ador Chowdhury (default)
  const greeting = await page.$eval('.dash-greeting', el => el.textContent.trim());
  console.log(`Active User Greeting: "${greeting}"`);
  if (!greeting.includes('Ador Chowdhury')) {
    throw new Error('FAILED: Default active user greeting is not Ador Chowdhury!');
  }

  const greetingHeight = await page.$eval('.dash-greeting', el => el.getBoundingClientRect().height);
  console.log(`Greeting height: ${greetingHeight}px (strictly single-line verified)`);
  if (greetingHeight > 60) {
    throw new Error(`FAILED: Greeting wrapped onto multiple lines (${greetingHeight}px)!`);
  }

  // Check upload button for this user
  const uploadForUserBtn = await page.$('#admin-upload-user-btn');
  if (!uploadForUserBtn) {
    throw new Error('FAILED: #admin-upload-user-btn not found on user dashboard for Admin!');
  }
  const uploadBtnText = await page.$eval('#admin-upload-user-btn', el => el.textContent.trim());
  console.log(`✓ Admin user upload button: "${uploadBtnText}"`);

  await page.screenshot({ path: path.join(artifactsDir, 'admin-viewing-user-ador.png') });

  console.log('\n--- Step 2: Switch to Rafiqul Islam (Dinajpur • Wheat) ---');
  await page.click('button[data-switch-user="rafiq@greenfields.bd"]');
  await page.waitForTimeout(800);

  const rafiqGreeting = await page.$eval('.dash-greeting', el => el.textContent.trim());
  console.log(`Switched User Greeting: "${rafiqGreeting}"`);
  if (!rafiqGreeting.includes('Rafiqul Islam')) {
    throw new Error('FAILED: Greeting did not switch to Rafiqul Islam!');
  }

  const subtitle = await page.$eval('.dash-subtitle', el => el.textContent.trim());
  console.log(`User Subtitle: "${subtitle}"`);
  if (!subtitle.includes('Autonomous Drone Crop Protection & Leaf-Level Pathology Monitor')) {
    throw new Error('FAILED: Subtitle is not original user dashboard subtitle!');
  }

  // Check 6 crops in fields-panel
  const fieldsCount = await page.$$eval('.dash-field-row', rows => rows.length);
  console.log(`✓ Original 6 Monitored Crop Sectors present: ${fieldsCount} fields.`);
  if (fieldsCount !== 6) {
    throw new Error(`FAILED: Expected 6 crop fields, found ${fieldsCount}!`);
  }

  // Check original 2 drone fleet cards
  const droneCount = await page.$$eval('.drone-card', cards => cards.length);
  console.log(`✓ Original Drone Fleet Status present: ${droneCount} drones.`);
  if (droneCount !== 2) {
    throw new Error(`FAILED: Expected 2 drones, found ${droneCount}!`);
  }

  await page.screenshot({ path: path.join(artifactsDir, 'admin-viewing-user-rafiqul.png') });

  console.log('\n--- Step 3: Switch to Tariqul Hasan (Rajshahi • Soybeans) ---');
  await page.selectOption('#admin-user-select', 'tariq@northern.ag');
  await page.waitForTimeout(800);

  const tariqGreeting = await page.$eval('.dash-greeting', el => el.textContent.trim());
  console.log(`Dropdown Switched Greeting: "${tariqGreeting}"`);
  if (!tariqGreeting.includes('Tariqul Hasan')) {
    throw new Error('FAILED: Greeting did not switch to Tariqul Hasan via dropdown!');
  }

  await page.screenshot({ path: path.join(artifactsDir, 'admin-viewing-user-tariqul.png') });

  console.log('\n--- Step 4: Test Uploading Hyperspectral Imagery for User Directly from Dashboard ---');
  await page.click('#admin-upload-user-btn');
  await page.waitForTimeout(400);

  const modal = await page.$('#admin-upload-modal');
  const modalDisplay = await page.$eval('#admin-upload-modal', el => el.style.display);
  if (modalDisplay !== 'flex') {
    throw new Error('FAILED: #admin-upload-modal did not open on button click!');
  }
  console.log('✓ Admin upload modal opened directly on dashboard.');

  // Click Mavic 3M preset
  await page.click('.preset-btn[data-preset="mavic3m"]');
  await page.waitForTimeout(200);

  // Submit modal
  await page.click('#upload-modal-submit-btn');
  await page.waitForTimeout(1000);

  // Verify notification banner is NOT rendered on user dashboard (user requested removal)
  if (imageryBanner) {
    throw new Error('FAILED: .dash-user-imagery-banner is still present on user dashboard!');
  }
  await page.screenshot({ path: path.join(artifactsDir, 'admin-attached-imagery-view.png') });

  console.log('\n--- Step 5: Verify Standard Grower Isolation ---');
  await page.click('.header-logout-btn');
  await page.waitForTimeout(800);

  // Login as regular grower
  await page.click('#tab-login-grower');
  await page.waitForTimeout(200);
  await page.click('#login-submit-btn');
  await page.waitForTimeout(1000);

  const growerUrl = page.url();
  console.log(`Grower URL: ${growerUrl}`);
  if (!growerUrl.includes('/dashboard')) {
    throw new Error('FAILED: Grower did not route to /dashboard!');
  }

  // Verify regular grower CANNOT see admin switcher or admin upload
  const growerSwitcher = await page.$('.admin-user-switcher-bar');
  if (growerSwitcher) {
    throw new Error('FAILED: .admin-user-switcher-bar is visible to normal grower!');
  }
  const growerUploadBtn = await page.$('#admin-upload-user-btn');
  if (growerUploadBtn) {
    throw new Error('FAILED: #admin-upload-user-btn is visible to normal grower!');
  }
  console.log('✓ Regular grower sees strictly their own dashboard with NO admin switcher bar.');

  await page.screenshot({ path: path.join(artifactsDir, 'grower-isolated-view.png'), fullPage: true });

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(artifactsDir, 'grower-dashboard-bottom.png') });

  console.log('\n======================================================');
  console.log('ALL E2E MULTI-USER ADMIN TESTS PASSED CLEANLY! (100%)');
  console.log('======================================================');

  await browser.close();
}

run().catch((err) => {
  console.error('\nTEST FAILED:', err);
  process.exit(1);
});
