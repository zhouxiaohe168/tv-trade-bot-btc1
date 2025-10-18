// pages/api/webhook.js  或 src/pages/api/webhook.js

export const config = {
  api: {
    bodyParser: false, // 我们手动读原始 body，避免 content-type 差异
  },
};

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    try {
      let data = [];
      req.on('data', (chunk) => data.push(chunk));
      req.on('end', () => resolve(Buffer.concat(data).toString('utf8')));
      req.on('error', reject);
    } catch (e) {
      reject(e);
    }
  });
}

export default async function handler(req, res) {
  const method = req.method || 'UNKNOWN';
  const url = req.url || '';
  let raw = '';

  try {
    // 只对可能有 body 的方法去读原始 body
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      raw = await readRawBody(req);
    }
  } catch (e) {
    console.error('[webhook] read body error:', e);
  }

  console.log('[webhook] HIT method=', method, 'url=', url, 'headers=', req.headers);
  if (raw) {
    console.log('[webhook] RAW BODY:', raw);
  }

  // 统一允许所有常见方法（不会再出现 405）
  res.setHeader('Allow', 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD');

  // 对 OPTIONS/HEAD 返回 204
  if (method === 'OPTIONS' || method === 'HEAD') {
    return res.status(204).end();
  }

  // GET 方便你浏览器健康检查
  if (method === 'GET') {
    try {
      const r = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
        { headers: { accept: 'application/json' } }
      );
      const data = await r.json();
      return res.status(200).json({
        ok: true,
        note: 'universal echo handler (test)',
        price: data?.bitcoin?.usd ?? null,
      });
    } catch (e) {
      console.error('[GET] fetch price error:', e);
      return res.status(200).json({ ok: true, note: 'universal echo handler (test)', price: null });
    }
  }

  // 其它方法直接回显
  let parsed = null;
  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch {
    // 保留 parsed = null
  }

  return res.status(200).json({
    ok: true,
    note: 'universal echo handler (test)',
    method,
    received_raw: raw || null,
    received_json: parsed,
  });
}
