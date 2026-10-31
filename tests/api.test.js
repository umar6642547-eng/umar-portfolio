// API integration tests. Needs `npm install` (express). Skipped automatically if deps are missing.
import test from 'node:test';
import assert from 'node:assert/strict';

let app = null;
try { app = (await import('../server/app.js')).default; } catch { /* deps not installed */ }
const skip = app ? false : 'express/mongoose not installed (run npm install)';

delete process.env.MONGODB_URI; // force the "no database" path so tests never touch a real DB

async function withServer(fn) {
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try { await fn(base); } finally { server.close(); }
}
const post = (base, body, headers = {}) =>
  fetch(`${base}/api/contact`, { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) });

test('GET /api/health', { skip }, () => withServer(async (b) => {
  const r = await fetch(`${b}/api/health`);
  assert.equal(r.status, 200);
  assert.equal((await r.json()).ok, true);
}));

test('GET /api/portfolio returns computed samples + security headers', { skip }, () => withServer(async (b) => {
  const r = await fetch(`${b}/api/portfolio`);
  assert.equal(r.status, 200);
  assert.equal(r.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(r.headers.get('x-powered-by'), null);
  const j = await r.json();
  assert.equal(j.samples.invoice.total, 192500);
  assert.equal(j.samples.pnl.netProfit, 1700000);
}));

test('POST /api/contact rejects invalid input with 400', { skip }, () => withServer(async (b) => {
  const r = await post(b, { name: '', email: 'x', message: 'y' });
  assert.equal(r.status, 400);
  const j = await r.json();
  assert.ok(j.errors.name && j.errors.email && j.errors.message);
}));

test('POST /api/contact rejects malformed JSON with 400', { skip }, () => withServer(async (b) => {
  assert.equal((await post(b, '{bad json')).status, 400);
}));

test('POST /api/contact honeypot is silently accepted, nothing stored', { skip }, () => withServer(async (b) => {
  const r = await post(b, { name: 'Bot', email: 'bot@x.com', message: 'buy cheap stuff now', website: 'http://spam' });
  assert.equal(r.status, 201);
}));

test('POST /api/contact returns 503 when no database is configured', { skip }, () => withServer(async (b) => {
  const r = await post(b, { name: 'Ali Khan', email: 'ali@example.com', message: 'Hello, we have an opening.' }, { 'x-forwarded-for': '9.9.9.9' });
  assert.equal(r.status, 503);
}));

test('unknown /api route returns JSON 404', { skip }, () => withServer(async (b) => {
  const r = await fetch(`${b}/api/nope`);
  assert.equal(r.status, 404);
  assert.equal((await r.json()).ok, false);
}));
