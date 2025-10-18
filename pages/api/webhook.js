// pages/api/webhook.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }
  try {
    const { data } = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
    );
    return res.status(200).json({ ok: true, price: data?.bitcoin?.usd ?? null });
  } catch (e) {
    return res.status(500).json({ ok: false, error: 'fetch_failed' });
  }
}
