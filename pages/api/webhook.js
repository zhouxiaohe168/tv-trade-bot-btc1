// pages/api/webhook.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // 使用 CoinGecko API 获取 BTC 的实时价格
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
      );
      const price = response.data.bitcoin.usd;

      // 返回 BTC 的当前价格
      return res.status(200).json({ price: price });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Unable to fetch BTC price' });
    }
  } else {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
