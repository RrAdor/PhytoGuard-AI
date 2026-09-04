import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const distDir = path.resolve(process.cwd(), 'dist');
const publicDir = path.resolve(process.cwd(), 'public');
const artifactsDir = '/home/ador/.gemini/antigravity/brain/f7739f2a-b6cc-40fd-9e5c-643d19c29274';

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

  await page.route('**/*', (route) => {
    const url = new URL(route.request().url());
    let pathname = decodeURIComponent(url.pathname);

    let filePath = path.join(distDir, pathname);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return route.fulfill({ status: 200, contentType: getContentType(filePath), body: fs.readFileSync(filePath) });
    }

    let pubPath = path.join(publicDir, pathname);
    if (fs.existsSync(pubPath) && fs.statSync(pubPath).isFile()) {
      return route.fulfill({ status: 200, contentType: getContentType(pubPath), body: fs.readFileSync(pubPath) });
    }

    const indexPath = path.join(distDir, 'index.html');
    return route.fulfill({ status: 200, contentType: 'text/html', body: fs.readFileSync(indexPath) });
  });

  console.log('--- Step 1: Check Farmer Login (Welcome in Middle) ---');
  await page.goto('http://localhost:3000/login');
  await page.waitForTimeout(500);

  const farmerTitleBox = await page.$eval('.auth-title', el => {
    const r = el.getBoundingClientRect();
    const parentR = el.parentElement.getBoundingClientRect();
    return {
      text: el.textContent.trim(),
      width: r.width,
      height: r.height,
      centerX: r.x + r.width / 2,
      parentCenterX: parentR.x + parentR.width / 2,
      display: window.getComputedStyle(el).display,
      justifyContent: window.getComputedStyle(el).justifyContent,
      textAlign: window.getComputedStyle(el).textAlign
    };
  });

  console.log('Farmer Title:', farmerTitleBox);
  const farmerOffset = Math.abs(farmerTitleBox.centerX - farmerTitleBox.parentCenterX);
  console.log(`Farmer Title Center Offset: ${farmerOffset}px (0px = perfectly centered)`);
  if (farmerOffset > 2) throw new Error('Farmer title is not centered!');
  console.log('✓ Farmer "Welcome" is perfectly in the middle!');

  await page.screenshot({ path: path.join(artifactsDir, 'farmer-login-welcome-centered.png') });
  console.log('✓ Saved screenshot farmer-login-welcome-centered.png');

  console.log('\n--- Step 2: Switch to Admin Login (Admin Gateway in One Line & Middle) ---');
  await page.click('#tab-login-admin');
  await page.waitForTimeout(300);

  const adminTitleBox = await page.$eval('.auth-title', el => {
    const r = el.getBoundingClientRect();
    const parentR = el.parentElement.getBoundingClientRect();
    return {
      text: el.textContent.trim(),
      width: r.width,
      height: r.height,
      centerX: r.x + r.width / 2,
      parentCenterX: parentR.x + parentR.width / 2,
      whiteSpace: window.getComputedStyle(el).whiteSpace,
      fontSize: window.getComputedStyle(el).fontSize,
      display: window.getComputedStyle(el).display,
      justifyContent: window.getComputedStyle(el).justifyContent,
      textAlign: window.getComputedStyle(el).textAlign
    };
  });

  console.log('Admin Title:', adminTitleBox);
  const adminOffset = Math.abs(adminTitleBox.centerX - adminTitleBox.parentCenterX);
  console.log(`Admin Title Center Offset: ${adminOffset}px (0px = perfectly centered)`);
  console.log(`Admin Title Height: ${adminTitleBox.height}px (single line height)`);
  if (adminOffset > 2) throw new Error('Admin title is not centered!');
  if (adminTitleBox.height > 55) throw new Error(`Admin title wrapped into multiple lines! Height: ${adminTitleBox.height}px`);
  console.log('✓ Admin "Admin Gateway 🛡️" is in ONE LINE and in the MIDDLE!');

  await page.screenshot({ path: path.join(artifactsDir, 'admin-login-oneline-centered.png') });
  console.log('✓ Saved screenshot admin-login-oneline-centered.png');

  await browser.close();
  console.log('\nALL LOGIN TITLE CHECKS PASSED (100%)!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
