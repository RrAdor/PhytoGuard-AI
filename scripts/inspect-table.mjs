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
  if (ext === '.tif' || ext === '.tiff') return 'image/tiff';
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

  await page.goto('http://localhost:3000/login');
  await page.waitForTimeout(500);
  await page.click('#tab-login-admin');
  await page.waitForTimeout(200);
  await page.click('#login-submit-btn');
  await page.waitForTimeout(1000);

  const thInfo = await page.$$eval('.admin-requests-table thead tr th', ths => 
    ths.map((th, i) => {
      const r = th.getBoundingClientRect();
      return { col: i + 1, text: th.textContent.trim(), x: Math.round(r.x), width: Math.round(r.width) };
    })
  );
  console.log('--- TABLE HEADERS (TH) ---');
  console.table(thInfo);

  const tdInfo = await page.$$eval('.admin-req-row:first-child td', tds => 
    tds.map((td, i) => {
      const r = td.getBoundingClientRect();
      const style = window.getComputedStyle(td);
      return { 
        col: i + 1, 
        className: td.className, 
        text: td.innerText.replace(/\n/g, ' | ').substring(0, 35), 
        x: Math.round(r.x), 
        width: Math.round(r.width),
        display: style.display
      };
    })
  );
  console.log('\n--- FIRST ROW CELLS (TD) ---');
  console.table(tdInfo);

  const artifactsDir = '/home/ador/.gemini/antigravity/brain/752aa210-bfd7-4c5b-898a-244cc4aa00db';
  await page.screenshot({ path: path.join(artifactsDir, 'admin-table-perfect-alignment.png') });
  console.log('✓ Screenshot saved to admin-table-perfect-alignment.png');

  const pendingBtn = await page.$('.btn-approve-request');
  if (pendingBtn) {
    await pendingBtn.scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(distDir, '../admin-table-buttons-view.png'), fullPage: false });
    console.log('✓ Screenshot saved to admin-table-buttons-view.png');
  }

  await browser.close();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
