// app/api/webhook/route.js

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: { 'Allow': 'GET, POST, OPTIONS' }
  });
}

export async function GET() {
  try {
    const r = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
      { method: 'GET', headers: { 'accept': 'application/json' } }
    );
    if (!r.ok) throw new Error('coingecko_failed');
    const data = await r.json();
    return Response.json({ ok: true, price: data?.bitcoin?.usd ?? null }, { status: 200 });
  } catch (e) {
    console.error('[GET] error:', e);
    return Response.json({ ok: false, error: 'fetch_failed' }, { status: 500 });
  }
}

export async function POST(req) {
  let body = {};
  try {
    // TradingView 默认 application/json
    const text = await req.text();
    body = text ? JSON.parse(text) : {};
  } catch {
    return Response.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  // 校验 secret（body.secret 或 Header: x-webhook-secret）
  const expected = process.env.WEBHOOK_SECRET || '';
  const headerSecret = req.headers.get('x-webhook-secret');
  const provided = body?.secret ?? headerSecret ?? '';
  if (expected && provided !== expected) {
    return Response.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  try {
    const r = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
      { method: 'GET', headers: { 'accept': 'application/json' } }
    );
    if (!r.ok) throw new Error('coingecko_failed');
    const data = await r.json();
    const btc = data?.bitcoin?.usd ?? null;

    console.log('[webhook] payload:', body);
    console.log('[webhook] btc_usd:', btc);

    // TODO: 在这里处理你的交易逻辑

    return Response.json({ ok: true, btc_usd: btc }, { status: 200 });
  } catch (e) {
    console.error('[POST] error:', e);
    return Response.json({ ok: false, error: 'fetch_failed' }, { status: 500 });
  }
}
