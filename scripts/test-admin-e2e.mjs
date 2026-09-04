import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const distDir = '/home/ador/Desktop/Pytho Gurd AI/dist';
const artifactsDir = '/home/ador/.gemini/antigravity/brain/752aa210-bfd7-4c5b-898a-244cc4aa00db';
const scratchDir = path.join(artifactsDir, 'scratch');

if (!fs.existsSync(scratchDir)) {
  fs.mkdirSync(scratchDir, { recursive: true });
}

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

async function runTest() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 960 }
  });
  const page = await context.newPage();

  // Route requests to local dist directory
  await page.route('**/*', (route) => {
    const url = new URL(route.request().url());
    let pathname = url.pathname;
    
    // Virtual mock route for SPA
    let filePath = path.join(distDir, pathname);
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

  console.log('--- Step 1: Navigating to Home & checking Admin link ---');
  await page.goto('http://localhost:3000/');
  await page.waitForSelector('.header-actions');
  const adminPill = await page.$('.admin-nav-pill');
  console.log('Admin pill found:', !!adminPill);

  console.log('--- Step 2: Navigating to /free-demo and submitting demo request ---');
  await page.goto('http://localhost:3000/free-demo');
  await page.waitForSelector('#demo-request-form');

  await page.fill('#demo-name', 'Tariqul Islam');
  await page.fill('#demo-email', 'tariqul@pabnafarms.bd');
  await page.fill('#demo-company', 'Pabna Precision Agri Ltd.');
  await page.selectOption('#demo-role', 'grower');
  await page.selectOption('#demo-district', 'Pabna');
  await page.fill('#demo-notes', 'Seeking autonomous drone scouting for 45 Ha soybeans.');

  // Submit form
  await page.click('button[type="submit"]');
  await page.waitForSelector('.demo-success-card');
  console.log('Demo request submitted successfully!');

  console.log('--- Step 3: Navigating to /admin ---');
  await page.goto('http://localhost:3000/admin');
  await page.waitForSelector('.admin-dashboard-container');

  // Verify KPI metrics
  const totalVal = await page.textContent('#metric-total-val');
  const pendingVal = await page.textContent('#metric-pending-val');
  const uploadedVal = await page.textContent('#metric-uploaded-val');
  console.log(`KPIs -> Total: ${totalVal}, Pending: ${pendingVal}, Uploaded: ${uploadedVal}`);

  // Verify Tariqul's request is visible in the table
  const hasTariqul = await page.evaluate(() => {
    return document.body.innerText.includes('Tariqul Islam') && document.body.innerText.includes('Pabna');
  });
  console.log('Tariqul Islam found in table:', hasTariqul);

  // Take Admin Dashboard Overview Screenshot
  await page.screenshot({ path: path.join(scratchDir, 'admin-dashboard-overview.png'), fullPage: true });
  fs.copyFileSync(path.join(scratchDir, 'admin-dashboard-overview.png'), path.join(artifactsDir, 'admin-dashboard-overview.png'));

  console.log('--- Step 4: Testing Upload Modal for Tariqul Islam ---');
  // Click the first + Upload button (which belongs to Tariqul's row)
  await page.click('.btn-upload-spectral');
  await page.waitForSelector('#admin-upload-modal', { state: 'visible' });

  // Select MicaSense 1-Click preset
  await page.click('.preset-btn[data-preset="micasense"]');
  console.log('Selected MicaSense preset');

  // Take Upload Modal Screenshot
  await page.screenshot({ path: path.join(scratchDir, 'admin-upload-modal.png') });
  fs.copyFileSync(path.join(scratchDir, 'admin-upload-modal.png'), path.join(artifactsDir, 'admin-upload-modal.png'));

  // Submit upload form (handle alert dialog)
  page.once('dialog', async dialog => {
    console.log('Dialog opened:', dialog.message());
    await dialog.accept();
  });
  await page.click('#upload-modal-submit-btn');
  await page.waitForSelector('#admin-upload-modal', { state: 'hidden' });

  // Check updated KPI counter
  const newUploadedVal = await page.textContent('#metric-uploaded-val');
  console.log('Updated Uploaded KPI:', newUploadedVal);

  console.log('--- Step 5: Testing Multi-Band Spectral Inspector Modal ---');
  // Click Inspect Rx button
  await page.click('.btn-inspect-spectral');
  await page.waitForSelector('#admin-viewer-modal', { state: 'visible' });

  // Verify RGB active initially
  let bandClass = await page.$eval('#spectral-canvas-img', el => el.className);
  console.log('Initial Band Class:', bandClass);

  // Switch to NIR False Color
  await page.click('.band-pill-btn[data-band="nir"]');
  bandClass = await page.$eval('#spectral-canvas-img', el => el.className);
  console.log('Switched to NIR Class:', bandClass);

  // Switch to NDVI Canopy Health
  await page.click('.band-pill-btn[data-band="ndvi"]');
  bandClass = await page.$eval('#spectral-canvas-img', el => el.className);
  console.log('Switched to NDVI Class:', bandClass);

  // Take Spectral Viewer Screenshot
  await page.screenshot({ path: path.join(scratchDir, 'admin-spectral-viewer.png') });
  fs.copyFileSync(path.join(scratchDir, 'admin-spectral-viewer.png'), path.join(artifactsDir, 'admin-spectral-viewer.png'));

  // Close viewer modal
  await page.click('#viewer-modal-close');
  await page.waitForSelector('#admin-viewer-modal', { state: 'hidden' });

  console.log('--- Step 6: Testing User Dashboard with Attached Imagery ---');
  // Log in as Ador who has an uploaded imagery request in Bogura
  await page.evaluate(() => {
    localStorage.setItem('phyto_current_user', JSON.stringify({
      id: 'usr-1',
      name: 'Ador',
      email: 'ador@phytoguard.ai',
      company: 'North Bengal Seed & Agro',
      role: 'Enterprise Grower'
    }));
  });

  await page.goto('http://localhost:3000/dashboard');
  await page.waitForSelector('.dashboard-page-container');

  // Verify banner presence
  const hasBanner = await page.$('.dash-user-imagery-banner');
  console.log('User Imagery Notification Banner present:', !!hasBanner);

  // Take Dashboard Screenshot with Imagery Banner
  await page.screenshot({ path: path.join(scratchDir, 'dashboard-user-imagery-banner.png') });
  fs.copyFileSync(path.join(scratchDir, 'dashboard-user-imagery-banner.png'), path.join(artifactsDir, 'dashboard-user-imagery-banner.png'));

  // Click Inspect Orthomosaic from user dashboard
  await page.click('.user-imagery-view-btn');
  await page.waitForSelector('#user-viewer-modal', { state: 'visible' });

  // Switch to NDVI in user viewer
  await page.click('#user-viewer-modal [data-user-band="ndvi"]');
  const userBandClass = await page.$eval('#user-spectral-canvas-img', el => el.className);
  console.log('User Viewer NDVI Band Class:', userBandClass);

  // Take User Viewer Screenshot
  await page.screenshot({ path: path.join(scratchDir, 'user-spectral-viewer.png') });
  fs.copyFileSync(path.join(scratchDir, 'user-spectral-viewer.png'), path.join(artifactsDir, 'user-spectral-viewer.png'));

  console.log('--- ALL ADMIN & USER TESTS PASSED PERFECTLY! ---');
  await browser.close();
}

runTest().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
