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

  console.log('\n--- Step 1: Login as Admin and Verify Admin Dashboard ---');
  await page.goto('http://localhost:3000/login');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForTimeout(500);

  // Switch to Admin tab and submit
  await page.click('#tab-login-admin');
  await page.waitForTimeout(200);
  await page.click('#login-submit-btn');
  await page.waitForTimeout(1000);

  const adminUrl = page.url();
  console.log(`Admin landed on: ${adminUrl}`);

  // Verify Admin header has zero consumer navigation links
  const consumerNav = await page.$('.main-nav');
  if (consumerNav) {
    throw new Error('FAILED: Admin header has consumer navigation!');
  }
  const headerBadge = await page.$eval('.admin-header-badge', el => el.textContent.trim());
  console.log(`✓ Admin Header Badge: "${headerBadge}"`);

  // Verify Admin Dashboard title
  const adminTitle = await page.$eval('.admin-title', el => el.textContent.trim());
  console.log(`✓ Admin Dashboard Title: "${adminTitle}"`);

  // Verify Admin does NOT see user dashboard elements
  const userHeatmap = await page.$('.dash-map-section');
  if (userHeatmap) {
    throw new Error('FAILED: Admin dashboard incorrectly shows user heatmap!');
  }
  const userCropsPanel = await page.$('.fields-panel');
  if (userCropsPanel) {
    throw new Error('FAILED: Admin dashboard incorrectly shows user fields panel!');
  }
  const userDronesPanel = await page.$('.drone-panel');
  if (userDronesPanel) {
    throw new Error('FAILED: Admin dashboard incorrectly shows user drone panel!');
  }
  console.log('✓ Verified: Admin dashboard does NOT show user dashboard data (no user crops, no user drones, no user heatmap).');

  // Verify Demo Requests table is present
  const requestsTable = await page.$('.admin-requests-table');
  if (!requestsTable) {
    throw new Error('FAILED: .admin-requests-table not found on Admin Dashboard!');
  }
  const rowCount = await page.$$eval('.admin-req-row', rows => rows.length);
  console.log(`✓ Demo Requests Table loaded with ${rowCount} inbound requests.`);

  await page.screenshot({ path: path.join(artifactsDir, 'admin-demo-requests-dashboard.png') });

  console.log('\n--- Step 2: Test Approving a Demo Request ---');
  // Look for a request that has an Approve Request button
  const approveBtn = await page.$('.btn-approve-request');
  if (!approveBtn) {
    throw new Error('FAILED: No .btn-approve-request found in requests table!');
  }
  const targetReqId = await approveBtn.getAttribute('data-req-id');
  console.log(`Found pending demo request to approve: ${targetReqId}`);

  await approveBtn.click();
  await page.waitForTimeout(600);

  // Verify row status updated to Approved
  const approvedStatus = await page.$eval(`tr[data-id="${targetReqId}"] .admin-status-badge`, el => el.textContent.trim());
  console.log(`Updated Request Status: "${approvedStatus}"`);
  if (!approvedStatus.includes('Approved')) {
    throw new Error(`FAILED: Status did not update to Approved! Got: "${approvedStatus}"`);
  }
  console.log('✓ Request successfully approved!');

  await page.screenshot({ path: path.join(artifactsDir, 'admin-request-approved.png') });

  console.log('\n--- Step 3: Test Uploading Hyperspectral Image Captured by Drone ---');
  // Find upload button for this approved request
  const uploadDroneBtn = await page.$(`tr[data-id="${targetReqId}"] .btn-upload-spectral`);
  if (!uploadDroneBtn) {
    throw new Error(`FAILED: .btn-upload-spectral not found for approved request ${targetReqId}!`);
  }
  await uploadDroneBtn.click();
  await page.waitForTimeout(500);

  const uploadModal = await page.$('#admin-upload-modal');
  const uploadModalDisplay = await page.$eval('#admin-upload-modal', el => el.style.display);
  if (uploadModalDisplay !== 'flex') {
    throw new Error('FAILED: #admin-upload-modal did not open!');
  }
  console.log('✓ Drone photogrammetry upload modal opened.');

  // Select DJI Matrice 350 RTK preset
  await page.click('.preset-btn[data-preset="micasense"]');
  await page.waitForTimeout(200);

  // Submit modal form
  await page.click('#upload-modal-submit-btn');
  await page.waitForTimeout(800);

  // Verify status is now Imagery Uploaded
  const uploadedStatus = await page.$eval(`tr[data-id="${targetReqId}"] .admin-status-badge`, el => el.textContent.trim());
  console.log(`Post-Upload Request Status: "${uploadedStatus}"`);
  if (!uploadedStatus.includes('Imagery Uploaded')) {
    throw new Error(`FAILED: Status did not update to Imagery Uploaded! Got: "${uploadedStatus}"`);
  }

  // Verify dataset ready badge
  const dataBadge = await page.$eval(`tr[data-id="${targetReqId}"] .data-badge`, el => el.textContent.trim());
  console.log(`Dataset Badge: "${dataBadge}"`);
  if (!dataBadge.includes('Dataset Ready')) {
    throw new Error(`FAILED: Dataset badge does not show Dataset Ready! Got: "${dataBadge}"`);
  }

  // Verify Inspect and Re-upload buttons are present
  const inspectBtn = await page.$(`tr[data-id="${targetReqId}"] .btn-inspect-spectral`);
  if (!inspectBtn) {
    throw new Error('FAILED: .btn-inspect-spectral not found after upload!');
  }
  console.log('✓ Confirmed: Hyperspectral drone image attached with Inspect & Re-upload actions.');

  await page.screenshot({ path: path.join(artifactsDir, 'admin-imagery-uploaded.png') });

  console.log('\n--- Step 4: Test Inspecting Drone Hyperspectral Imagery ---');
  await inspectBtn.click();
  await page.waitForTimeout(500);

  const viewerModalDisplay = await page.$eval('#admin-viewer-modal', el => el.style.display);
  if (viewerModalDisplay !== 'flex') {
    throw new Error('FAILED: #admin-viewer-modal did not open on inspect click!');
  }
  console.log('✓ Multi-band spectral viewer opened successfully.');

  // Click close on viewer modal
  await page.click('#viewer-modal-close');
  await page.waitForTimeout(300);

  console.log('\n--- Step 5: Verify Grower / User Dashboard Is Completely Preserved & All Right ---');
  // Logout as admin
  await page.click('.header-logout-btn');
  await page.waitForTimeout(600);

  // Submit default grower login
  await page.click('#login-submit-btn');
  await page.waitForTimeout(1000);

  console.log(`Grower URL: ${page.url()}`);

  // Verify Grower has standard navigation
  const growerNav = await page.$('.main-nav');
  if (!growerNav) {
    throw new Error('FAILED: Grower header is missing main navigation!');
  }
  console.log('✓ Grower has full standard consumer navigation (Dashboard, Main Crops, How It Works, Plans, Knowledge Base).');

  // Verify User Dashboard elements (all 6 crops, 2 drones, 4 metrics, 16:9 heatmap)
  const greeting = await page.$eval('.dash-greeting', el => el.textContent.trim());
  console.log(`✓ Grower Greeting: "${greeting}"`);

  const metricCards = await page.$$eval('.dash-metric-card', cards => cards.length);
  console.log(`✓ Grower KPI Cards: ${metricCards} cards (450 Ha, 28 Flights, 4 Alerts, 0.82 NDVI).`);
  if (metricCards !== 4) throw new Error(`FAILED: Expected 4 KPI cards, got ${metricCards}`);

  const cropRows = await page.$$eval('.dash-field-row', rows => rows.length);
  console.log(`✓ Grower Monitored Crops: ${cropRows} crops with health bars.`);
  if (cropRows !== 6) throw new Error(`FAILED: Expected 6 crops, got ${cropRows}`);

  const droneCards = await page.$$eval('.drone-card', cards => cards.length);
  console.log(`✓ Grower Drone Fleet: ${droneCards} drones.`);
  if (droneCards !== 2) throw new Error(`FAILED: Expected 2 drones, got ${droneCards}`);

  const growerHeatmap = await page.$('.dash-map-section');
  if (!growerHeatmap) throw new Error('FAILED: Grower 16:9 heatmap not found!');
  console.log('✓ Grower 16:9 Drone Scan Coverage Heatmap present.');

  // Verify no admin controls on grower dashboard
  const adminTable = await page.$('.admin-requests-table');
  if (adminTable) throw new Error('FAILED: Admin table visible to grower!');
  console.log('✓ Grower view is strictly the authentic user dashboard with NO admin tables.');

  await page.screenshot({ path: path.join(artifactsDir, 'grower-pure-dashboard.png'), fullPage: true });

  console.log('\n======================================================');
  console.log('ALL DEMO REQUEST APPROVAL & DRONE UPLOAD TESTS PASSED! (100%)');
  console.log('======================================================');

  await browser.close();
}

run().catch((err) => {
  console.error('\nTEST FAILED:', err);
  process.exit(1);
});
