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
  return 'application/octet-stream';
}

async function run() {
  console.log('🚀 Starting Grower User Scan Notification & 100x100 Box Lifecycle Automated Test...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

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

  // Step 1: Login as Grower
  console.log('\n--- Step 1: Login as Regular Grower (Ador Chowdhury) ---');
  await page.goto('http://localhost:3000/login');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForTimeout(400);

  // Click login submit directly as grower
  await page.click('#login-submit-btn');
  await page.waitForTimeout(800);

  const growerUrl = page.url();
  console.log(`Grower landed on: ${growerUrl}`);

  // Step 2: Verify NOT a Direct Result Notification -> Shows Scanning in Progress
  console.log('\n--- Step 2: Verify Initial "Scanning in Progress" State (No Direct Result) ---');
  const notifyCard = await page.$('#dash-scan-notification-card');
  if (!notifyCard) {
    throw new Error('FAILED: #dash-scan-notification-card not found on Grower Dashboard!');
  }
  const isScanningCard = await page.$('.dash-scan-notification-card.is-scanning');
  if (!isScanningCard) {
    throw new Error('FAILED: Notification card is not in scanning state on initial load!');
  }
  const scanningTag = await page.$eval('.scan-notify-tag', el => el.textContent.trim());
  console.log(`✓ Scan Notification Tag: "${scanningTag}"`);
  if (!scanningTag.includes('SCAN') && !scanningTag.includes('PROGRESS')) {
    throw new Error(`FAILED: Tag does not indicate scanning in progress: ${scanningTag}`);
  }

  // Verify 100x100 Radar Scanning Box
  const scanningBox = await page.$('.scan-box-100.is-scanning');
  if (!scanningBox) {
    throw new Error('FAILED: 100x100 scanning box (.scan-box-100.is-scanning) not found!');
  }
  const scanBoxBox = await scanningBox.boundingBox();
  console.log(`✓ 100x100 Scanning Box Dimensions: ${Math.round(scanBoxBox.width)}px × ${Math.round(scanBoxBox.height)}px`);
  if (Math.round(scanBoxBox.width) !== 100 || Math.round(scanBoxBox.height) !== 100) {
    throw new Error(`FAILED: Scanning box is not exactly 100x100! Got: ${scanBoxBox.width}x${scanBoxBox.height}`);
  }

  const completeBtn = await page.$('#user-complete-scan-btn');
  if (!completeBtn) {
    throw new Error('FAILED: #user-complete-scan-btn not found in scanning card!');
  }
  console.log('✓ Verified: Scanning in progress is shown with active 100x100 radar chamber and Complete Scan CTA.');

  const scanningScreenshotPath = path.join(artifactsDir, 'grower-scanning-in-progress.png');
  await page.screenshot({ path: scanningScreenshotPath });
  console.log(`📸 Captured screenshot: ${scanningScreenshotPath}`);

  // Step 3: Complete Scan & Trigger Neural Inference
  console.log('\n--- Step 3: Complete Scan & Run CNN Neural Inference ---');
  await completeBtn.click();
  // Wait for forward pass and re-render
  await page.waitForTimeout(1400);

  // Step 4: Verify Results Ready in 100x100 Box in a Proper Way
  console.log('\n--- Step 4: Verify Result Ready State & 100x100 Result Box in a Proper Way ---');
  const completedCard = await page.$('.dash-scan-notification-card.is-completed');
  if (!completedCard) {
    throw new Error('FAILED: Notification card did not transition to is-completed!');
  }
  const completedTag = await page.$eval('.scan-notify-tag', el => el.textContent.trim());
  console.log(`✓ Scan Notification Tag: "${completedTag}"`);
  if (!completedTag.includes('COMPLETED')) {
    throw new Error(`FAILED: Tag does not indicate scan completed: ${completedTag}`);
  }

  // Verify 100x100 Result Box
  const resultBox = await page.$('.scan-box-100.is-result');
  if (!resultBox) {
    throw new Error('FAILED: 100x100 result box (.scan-box-100.is-result) not found!');
  }
  const resultBoxBox = await resultBox.boundingBox();
  console.log(`✓ 100x100 Result Box Dimensions: ${Math.round(resultBoxBox.width)}px × ${Math.round(resultBoxBox.height)}px`);
  if (Math.round(resultBoxBox.width) !== 100 || Math.round(resultBoxBox.height) !== 100) {
    throw new Error(`FAILED: Result box is not exactly 100x100! Got: ${resultBoxBox.width}x${resultBoxBox.height}`);
  }

  // Verify image inside 100x100 result box
  const resultImg = await page.$('.scan-box-100.is-result img.scan-100-img');
  if (!resultImg) {
    throw new Error('FAILED: Scanned result image not found inside 100x100 box!');
  }
  const resultImgSrc = await resultImg.getAttribute('src');
  console.log(`✓ Scanned Image inside 100x100 Box: "${resultImgSrc}"`);

  // Verify corner badge (100x100) and status strip
  const cornerBadge = await page.$eval('.scan-box-100.is-result .scan-100-badge', el => el.textContent.trim());
  console.log(`✓ 100x100 Box Corner Badge: "${cornerBadge}"`);
  const statusStrip = await page.$eval('.scan-box-100.is-result .scan-100-status', el => el.textContent.trim());
  console.log(`✓ 100x100 Box Status Strip: "${statusStrip}"`);

  const resultScreenshotPath = path.join(artifactsDir, 'grower-100x100-result-box.png');
  await page.screenshot({ path: resultScreenshotPath });
  console.log(`📸 Captured screenshot: ${resultScreenshotPath}`);

  // Step 5: Click 100x100 Box to open Inspect Rx Modal
  console.log('\n--- Step 5: Click 100x100 Box & Inspect Rx Modal Details ---');
  await resultBox.click();
  await page.waitForTimeout(500);

  const userModal = await page.$('#user-viewer-modal');
  const modalDisplay = await page.$eval('#user-viewer-modal', el => el.style.display);
  console.log(`User viewer modal display: "${modalDisplay}"`);
  if (modalDisplay !== 'flex') {
    throw new Error('FAILED: #user-viewer-modal did not open on 100x100 box click!');
  }
  console.log('✓ Grower Inspect Rx modal opened successfully!');

  // Verify 100x100 Specimen ROI inside modal
  const modalRoi100 = await page.$('.modal-roi-100box');
  if (!modalRoi100) {
    throw new Error('FAILED: .modal-roi-100box not found inside Inspect Rx modal!');
  }
  const modalRoiBox = await modalRoi100.boundingBox();
  console.log(`✓ Modal 100x100 Specimen Box Dimensions: ${Math.round(modalRoiBox.width)}px × ${Math.round(modalRoiBox.height)}px`);
  if (Math.round(modalRoiBox.width) !== 100 || Math.round(modalRoiBox.height) !== 100) {
    throw new Error(`FAILED: Modal ROI box is not 100x100! Got: ${modalRoiBox.width}x${modalRoiBox.height}`);
  }

  // Verify 4-band spectral switching
  console.log('\n--- Step 6: Test Multi-Band Layer Switching ---');
  for (const band of ['nir', 'ndvi', 'thermal', 'rgb']) {
    await page.click(`button[data-user-band="${band}"]`);
    await page.waitForTimeout(150);
    const canvasClass = await page.$eval('#user-spectral-canvas-img', el => el.className);
    console.log(`Band "${band}" -> Canvas class: "${canvasClass}"`);
    if (!canvasClass.includes(`band-${band}`)) {
      throw new Error(`FAILED: #user-spectral-canvas-img does not contain class band-${band}!`);
    }
  }

  // Close modal
  await page.click('#user-viewer-modal-close');
  await page.waitForTimeout(300);
  console.log('✓ Modal closed via close button.');

  // Step 7: Test Request New Scan Reset
  console.log('\n--- Step 7: Test "Request New Scan" Reset ---');
  const newScanBtn = await page.$('#user-request-new-scan-btn');
  if (!newScanBtn) {
    throw new Error('FAILED: #user-request-new-scan-btn not found!');
  }
  await newScanBtn.click();
  await page.waitForTimeout(500);

  const resetScanningCard = await page.$('.dash-scan-notification-card.is-scanning');
  if (!resetScanningCard) {
    throw new Error('FAILED: Card did not reset to is-scanning on Request New Scan click!');
  }
  console.log('✓ Verified: "New Scan" button successfully resets state back to "Scanning in progress".');

  await browser.close();
  console.log('\n🎉 ALL SCAN NOTIFICATION & 100x100 BOX TESTS PASSED (100%)!\n');
}

run().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
