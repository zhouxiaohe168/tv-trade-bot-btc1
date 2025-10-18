// pages/api/webhook.js （或 src/pages/api/webhook.js）
export default function handler(req, res) {
  res.setHeader('Allow', 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD');
  return res.status(200).json({
    ok: true,
    from: '/api/webhook',
    method: req.method,
    hint: 'if you STILL see 405, your request never reached this function (middleware/rewrites/old deploy).'
  });
}
