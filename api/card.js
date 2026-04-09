import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium-min';

const CHROMIUM_URL = 'https://github.com/Sparticuz/chromium/releases/download/v143.0.4/chromium-v143.0.4-pack.x64.tar';

let _browser = null;

async function getBrowser() {
  if (_browser && _browser.isConnected()) return _browser;
  _browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(CHROMIUM_URL),
    headless: true,
    defaultViewport: null,
  });
  return _browser;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');

  const { slug = 'rezhisser', name = '', her = '', day = '0', type = 'story' } = req.query;

  const base = `https://${req.headers.host}`;
  const template = type === 'friend' ? 'card-friend.html' : 'card-story.html';
  const pageUrl = `${base}/${template}?slug=${encodeURIComponent(slug)}&name=${encodeURIComponent(name)}&her=${encodeURIComponent(her)}&day=${day}`;
  const W = type === 'friend' ? 1080 : 1080;
  const H = type === 'friend' ? 1080 : 1920;

  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
    await page.goto(pageUrl, { waitUntil: 'networkidle0', timeout: 15000 });
    await page.waitForFunction('window._ready === true', { timeout: 5000 });

    const screenshot = await page.screenshot({ type: 'jpeg', quality: 90, fullPage: false });
    await page.close();

    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Length', screenshot.length);
    res.status(200);
    res.end(screenshot);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
