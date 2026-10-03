// Captures Kidty screenshots of the showcase account with headless Chrome
// over the DevTools Protocol (no extra dependencies). See README.md.
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';

const OUT = new URL('./out/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
const APP = 'http://localhost:3000';
const API = 'http://localhost:8088/api';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9333;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${OUT}chrome-profile`,
  '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', '--disable-extensions',
], { stdio: 'ignore' });

async function connect() {
  for (let i = 0; i < 50; i++) {
    try {
      const target = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })).json();
      return target.webSocketDebuggerUrl;
    } catch { await sleep(200); }
  }
  throw new Error('Chrome did not start');
}

const ws = new WebSocket(await connect());
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let nextId = 0;
const pending = new Map();
ws.addEventListener('message', (e) => {
  const msg = JSON.parse(e.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
  }
});
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++nextId;
  pending.set(id, { resolve, reject });
  ws.send(JSON.stringify({ id, method, params }));
});
const evaluate = async (expression) =>
  (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result.value;

const { token } = await (await fetch(`${API}/auth/login`, {
  method: 'POST', headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ email: process.env.SHOWCASE_EMAIL, password: process.env.SHOWCASE_PASSWORD }),
})).json();
if (!token) throw new Error('Showcase login failed');

async function open(width, height, scale, mobile, setup = '') {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: scale, mobile });
  await send('Emulation.setDefaultBackgroundColorOverride', {});
  await send('Page.navigate', { url: `${APP}/#/about` });
  await sleep(1500);
  await evaluate(`localStorage.setItem('authToken', ${JSON.stringify(token)});
    localStorage.setItem('isAuthorized', 'true'); localStorage.setItem('kidty-lang', 'en'); true`);
  await send('Page.navigate', { url: `${APP}/#/account` });
  await evaluate(`location.reload(); true`);
  await sleep(5000); // initial loading screen + data
  if (setup) { await evaluate(setup); await sleep(800); }
  await evaluate(`window.scrollTo(0, 0); document.activeElement?.blur(); true`);
  await sleep(300);
}

const save = async (name, params = {}) => {
  const { data } = await send('Page.captureScreenshot', { format: 'png', ...params });
  writeFileSync(`${OUT}${name}.png`, Buffer.from(data, 'base64'));
  console.log('saved', name);
};

// Crops one dashboard card (found by its heading) with a transparent surround.
async function card(name, heading, pad = 28) {
  const rect = await evaluate(`(() => {
    const h = [...document.querySelectorAll('h2')].find((el) => el.textContent === ${JSON.stringify(heading)});
    const section = h.closest('section');
    section.scrollIntoView({ block: 'center' });
    for (let el = section.parentElement; el; el = el.parentElement) el.style.background = 'transparent';
    document.querySelectorAll('section, header, footer').forEach((el) => { if (el !== section) el.style.visibility = 'hidden'; });
    document.documentElement.style.background = 'transparent';
    const r = section.getBoundingClientRect();
    return { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height };
  })()`);
  await send('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });
  await sleep(300);
  await save(name, { captureBeyondViewport: true, clip: {
    x: rect.x - pad, y: rect.y - pad, width: rect.width + (pad * 2), height: rect.height + (pad * 2), scale: 1 } });
}

const clickAllTime = (heading) => `(() => {
  const h = [...document.querySelectorAll('h2')].find((el) => el.textContent === '${heading}');
  [...h.closest('section').querySelectorAll('button')].find((b) => b.textContent === 'All time').click();
  return true;
})()`;

await send('Page.enable');
await send('Runtime.enable');

// Desktop dashboard: height by year, weight over all time.
await open(1440, 900, 2, false, clickAllTime('Weight'));
await save('desktop');

// Cards for the feature section.
await card('weight-card', 'Weight');
await open(1440, 900, 2, false);
await card('vaccines-card', 'Vaccinations');

// Phone.
await open(390, 844, 3, true);
await save('mobile');

ws.close();
chrome.kill();
