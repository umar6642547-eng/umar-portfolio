import express from 'express';
import { buildPortfolio } from './data/portfolio.js';
import { validateContact } from './lib/validate.js';
import { connectDB } from './db.js';
import Message from './models/Message.js';

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '10kb' }));

app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  });
  next();
});

// Simple per-IP limit: 5 messages per hour (per server instance).
const hits = new Map();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_HITS = 5;
function limited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_HITS) { hits.set(ip, recent); return true; }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

app.get('/api/health', (_req, res) => res.json({ ok: true, db: Boolean(process.env.MONGODB_URI) }));

app.get('/api/portfolio', (_req, res) => {
  res.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  res.json(buildPortfolio());
});

app.post('/api/contact', async (req, res) => {
  // Honeypot: real visitors never fill the hidden "website" field.
  if (req.body && typeof req.body.website === 'string' && req.body.website.trim() !== '') {
    return res.status(201).json({ ok: true });
  }
  const { ok, errors, value } = validateContact(req.body);
  if (!ok) return res.status(400).json({ ok: false, errors });

  const ip = (req.headers['x-forwarded-for'] || '').toString().split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
  if (limited(ip)) return res.status(429).json({ ok: false, error: 'Too many messages. Please try again later.' });

  try {
    const conn = await connectDB();
    if (!conn) return res.status(503).json({ ok: false, error: 'Messages are not enabled on this server yet.' });
    await Message.create(value);
    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error('contact save failed:', err.message);
    return res.status(500).json({ ok: false, error: 'Could not save your message. Please email directly.' });
  }
});

app.use('/api', (_req, res) => res.status(404).json({ ok: false, error: 'Not found' }));

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ ok: false, error: 'Invalid JSON' });
  if (err.type === 'entity.too.large') return res.status(413).json({ ok: false, error: 'Payload too large' });
  console.error(err);
  res.status(500).json({ ok: false, error: 'Server error' });
});

export default app;
