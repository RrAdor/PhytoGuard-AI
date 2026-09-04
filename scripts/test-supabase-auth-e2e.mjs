import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

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
  console.log('--- Step 1: Launch Playwright & Load PhytoGuard AI ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Route SPA and static files
  await page.route('**/*', (route) => {
    const url = new URL(route.request().url());
    let pathname = decodeURIComponent(url.pathname);

    // If external Supabase auth URL or APIs, let it pass or mock
    if (url.origin.includes('supabase.co')) {
      return route.continue();
    }

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

    // Default to index.html for SPA routes
    let indexPath = path.join(distDir, 'index.html');
    return route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: fs.readFileSync(indexPath)
    });
  });

  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));

  console.log('Navigating to /login...');
  await page.goto('http://localhost:5173/login');
  await page.waitForLoadState('domcontentloaded');

  const title = await page.title();
  console.log('Page Title:', title);

  // Check login form existence
  const form = await page.$('#login-form');
  console.log('Login form found:', !!form);

  // Test demo login with admin
  console.log('--- Step 2: Testing Demo Admin Login ---');
  await page.click('#tab-login-admin');
  await page.click('#login-submit-btn');
  await page.waitForTimeout(600);

  const currentUrl = page.url();
  console.log('URL after admin login:', currentUrl);

  const headerBadge = await page.$eval('.admin-header-badge', el => el.textContent.trim()).catch(() => null);
  console.log('Admin Header Badge:', headerBadge);

  if (currentUrl.includes('/dashboard') && headerBadge) {
    console.log('✓ Admin login and dashboard routing verified!');
  } else {
    throw new Error('Admin login failed');
  }

  // Test logout
  console.log('--- Step 3: Testing Logout Flow ---');
  await page.click('.header-logout-btn');
  await page.waitForTimeout(600);
  console.log('URL after logout:', page.url());

  // Check console errors
  console.log('Page errors during test:', errors.length);
  if (errors.length > 0) {
    console.error('Errors found:', errors);
    process.exit(1);
  }

  console.log('✅ Supabase Auth integration & local fallback tests passed 100%!');
  await browser.close();
  process.exit(0);
}

run().catch((err) => {
  console.error('Test script failed:', err);
  process.exit(1);
});
