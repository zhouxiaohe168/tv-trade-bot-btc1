// pages/api/webhook.js  或 src/pages/api/webhook.js
export const config = { api: { bodyParser: true } };

export default async function handler(req, res) {
  if (req.method === 'OPTIONS' || req.method === 'HEAD') {
    res.setHeader('Allow', 'GET, POST, OPTIONS, HEAD');
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, note: 'health' });
  }

  if (req.method === 'POST') {
    const expected = process.env.WEBHOOK_SECRET || '';
    const provided = req.body?.secret || req.headers['x-webhook-secret'] || '';
    if (expected && provided !== expected) {
      return res.status(401).json({ ok: false, error: 'unauthorized' });
    }
    return res.status(200).json({ ok: true, received: req.body || null });
  }

  res.setHeader('Allow', 'GET, POST, OPTIONS, HEAD');
  return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
}
