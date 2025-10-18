// pages/api/webhook.js
import axios from 'axios';

export default async function handler(req, res) {
  // GET：健康检查 + 返回 BTC 价格（方便浏览器直接看）
  if (req.method === 'GET') {
    try {
      const { data } = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
      );
      return res.status(200).json({ ok: true, price: data?.bitcoin?.usd ?? null });
    } catch {
      return res.status(500).json({ ok: false, error: 'fetch_failed' });
    }
  }

  // POST：TradingView Webhook
  if (req.method === 'POST') {
    let body = {};
    try {
      body = typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
    } catch {
      return res.status(400).json({ ok: false, error: 'invalid_json' });
    }

    const expected = process.env.WEBHOOK_SECRET;
    if (expected && body?.secret !== expected) {
      return res.status(401).json({ ok: false, error: 'unauthorized' });
    }

    try {
      const { data } = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
      );
      const btc = data?.bitcoin?.usd ?? null;
      console.log('[webhook] payload:', body);
      console.log('[webhook] btc_usd:', btc);
      return res.status(200).json({ ok: true, btc_usd: btc });
    } catch {
      return res.status(500).json({ ok: false, error: 'fetch_failed' });
    }
  }

  // 其他方法不允许
  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
}
