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
  console.log('🚀 Starting PhytoGuard CNN Model Prediction Automated Test...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Track dialog alerts
  let alertMessage = '';
  page.on('dialog', async dialog => {
    alertMessage = dialog.message();
    console.log('\n📢 Browser Alert Received:\n' + alertMessage + '\n');
    await dialog.accept();
  });

  // Track console logs
  page.on('console', msg => {
    if (msg.text().includes('PhytoGuard CNN') || msg.text().includes('Forward Pass')) {
      console.log('🖥️ Console:', msg.text());
    }
  });

  // Serve static dist
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

  // Step 1: Admin Login
  console.log('\n--- Step 1: Login as Admin ---');
  await page.goto('http://localhost:3000/login');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForTimeout(400);

  await page.click('#tab-login-admin');
  await page.waitForTimeout(200);
  await page.click('#login-submit-btn');
  await page.waitForTimeout(1000);

  // Step 2: Approve pending request
  console.log('\n--- Step 2: Approve First Pending Request ---');
  const approveBtn = await page.$('.btn-approve-request');
  if (!approveBtn) {
    throw new Error('No .btn-approve-request found in table');
  }
  const targetReqId = await approveBtn.getAttribute('data-req-id');
  console.log(`Targeting request ID: ${targetReqId}`);
  await approveBtn.click();
  await page.waitForTimeout(600);

  // Step 3: Open Upload Modal
  console.log('\n--- Step 3: Open Photogrammetry Ingestion Modal ---');
  const uploadDroneBtn = await page.$(`tr[data-id="${targetReqId}"] .btn-upload-spectral`);
  if (!uploadDroneBtn) {
    throw new Error(`Upload button .btn-upload-spectral not found for ${targetReqId}`);
  }
  await uploadDroneBtn.click();
  await page.waitForTimeout(500);

  // Step 4: Select MicaSense Preset & Check form fields
  console.log('\n--- Step 4: Select Calibrated Drone Preset (MicaSense RedEdge-P) ---');
  await page.click('.preset-btn[data-preset="micasense"]');
  await page.waitForTimeout(300);

  // Step 5: Submit form and run real CNN Forward Pass
  console.log('\n--- Step 5: Submit Form & Trigger Real CNN Model Forward Pass ---');
  await page.click('#upload-modal-submit-btn');
  await page.waitForTimeout(1500);

  // Step 6: Verify Alert and Storage
  console.log('\n--- Step 6: Verifying CNN Output & Metadata ---');
  console.log('Asserting alert contains CNN model verification:');
  if (!alertMessage.includes('CNN Model Analysis Complete')) {
    throw new Error('Alert dialog did not indicate CNN Model Analysis Complete');
  }
  if (!alertMessage.includes('best_model.pt')) {
    throw new Error('Alert dialog did not reference best_model.pt checkpoint');
  }
  if (!alertMessage.includes('Model Confidence')) {
    throw new Error('Alert dialog missing model confidence percentage');
  }
  console.log('✅ Alert message verified with model checkpoint & confidence!');

  // Verify dataset status in table
  const statusBadge = await page.$eval(`tr[data-id="${targetReqId}"] .admin-status-badge`, el => el.textContent.trim());
  console.log(`Status badge in table: "${statusBadge}"`);
  if (!statusBadge.includes('Imagery Uploaded') && !statusBadge.includes('ফটোগ্রামেট্রি সম্পন্ন')) {
    throw new Error('Status badge did not update to Imagery Uploaded');
  }
  console.log('✅ Status updated to Imagery Uploaded');

  // Verify Inspect action and screenshot
  const inspectBtn = await page.$(`tr[data-id="${targetReqId}"] .btn-inspect-spectral`);
  if (inspectBtn) {
    await inspectBtn.click();
    await page.waitForTimeout(600);
    const screenshotPath = path.join(artifactsDir, 'admin-cnn-prediction-verified.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`📸 Captured screenshot: ${screenshotPath}`);
  }

  await browser.close();
  console.log('\n🎉 ALL CNN MODEL PREDICTION TESTS PASSED WITH 100% SUCCESS!\n');
}

run().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
