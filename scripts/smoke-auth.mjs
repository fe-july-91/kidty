// Smoke test of the login flow in headless Chrome (needs both dev servers).
// EMAIL=... PASSWORD=... node scripts/smoke-auth.mjs
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PORT = 9334;
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), "kidty-smoke-"))}`, '--no-first-run',
], { stdio: 'ignore' });
let wsUrl;
for (let i = 0; i < 50 && !wsUrl; i++) {
  try { wsUrl = (await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })).json()).webSocketDebuggerUrl; }
  catch { await sleep(200); }
}
const ws = new WebSocket(wsUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0; const pending = new Map();
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id) { pending.get(m.id)?.(m); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });
const run = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
const check = (label, ok) => { console.log(`${ok ? 'PASS' : 'FAIL'} ${label}`); if (!ok) process.exitCode = 1; };

await send('Page.navigate', { url: 'http://localhost:3000/#/login' });
await sleep(4500);
// Fill the React-controlled inputs and submit.
await run(`(() => {
  const set = (el, v) => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, v); el.dispatchEvent(new Event('input', { bubbles: true })); };
  set(document.querySelector('input[type=email]'), ${JSON.stringify(process.env.EMAIL)});
  set(document.querySelector('input[type=password]'), ${JSON.stringify(process.env.PASSWORD)});
  return true;
})()`);
await sleep(300);
await run(`[...document.querySelectorAll('form button')].find((b) => b.textContent.trim() === 'Log in').click(), true`);
await sleep(3500);
check('lands on the dashboard after login', (await run('location.hash')) === '#/account');
check('session cookie is not readable from JS', !(await run('document.cookie')).includes('kidty_session'));
const stored = await run('JSON.stringify(Object.keys(localStorage))');
check(`no token or password in localStorage ${stored}`, !/authToken|password/.test(stored));
check('remembered email only', (await run(`localStorage.getItem('email')`)) === JSON.stringify(process.env.EMAIL));

await run('location.reload(), true');
await sleep(5000);
check('session survives a reload', (await run(`!!document.querySelector('h2') && location.hash`)) === '#/account');

await run(`[...document.querySelectorAll('header a')].find((a) => a.textContent === 'Log out').click(), true`);
await sleep(1500);
await send('Page.navigate', { url: 'http://localhost:3000/#/account' });
await sleep(4500);
check('after logout the dashboard redirects to login', (await run('location.hash')) === '#/login');

ws.close(); chrome.kill();
