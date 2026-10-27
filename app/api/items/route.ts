let memoryItems: Map<string, any> = new Map();

async function getDB() {
  try {
    const cf = await (Function('return import("cloudflare:workers")')());
    return cf?.env?.DB || null;
  } catch {
    return null;
  }
}

export async function GET() {
  const db = await getDB();
  if (db) {
    const r = await db.prepare('SELECT data FROM items').all();
    return Response.json(r.results.map((x: any) => JSON.parse(x.data)));
  }
  return Response.json(Array.from(memoryItems.values()));
}

export async function POST(req: Request) {
  if (req.headers.get('sec-fetch-site') === 'cross-site') return new Response('Forbidden', { status: 403 });
  const x: any = await req.json();
  if (!x.id || !x.name || typeof x.name !== 'string' || JSON.stringify(x).length > 30000) return new Response('Invalid item', { status: 400 });
  const db = await getDB();
  if (db) {
    await db.prepare('INSERT INTO items (id,data) VALUES (?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data').bind(x.id, JSON.stringify(x)).run();
  } else {
    memoryItems.set(x.id, x);
  }
  return Response.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (req.headers.get('sec-fetch-site') === 'cross-site') return new Response('Forbidden', { status: 403 });
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return new Response('Missing id', { status: 400 });
  const db = await getDB();
  if (db) {
    await db.prepare('DELETE FROM items WHERE id=?').bind(id).run();
  } else {
    memoryItems.delete(id);
  }
  return Response.json({ ok: true });
}
