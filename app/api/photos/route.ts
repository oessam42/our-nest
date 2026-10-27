let memoryPhotos: Map<string, { buffer: ArrayBuffer, type: string }> = new Map();

async function getBucket() {
  try {
    const cf = await (Function('return import("cloudflare:workers")')());
    return cf?.env?.BUCKET || null;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  if (req.headers.get('sec-fetch-site') === 'cross-site') return new Response('Forbidden', { status: 403 });
  const data = await req.formData();
  const f = data.get('photo') as File;
  if (!f || !['image/jpeg', 'image/png', 'image/webp'].includes(f.type) || f.size > 8 * 1024 * 1024) {
    return new Response('Use a JPG, PNG or WebP under 8 MB', { status: 400 });
  }
  const key = crypto.randomUUID();
  const buf = await f.arrayBuffer();
  const bucket = await getBucket();
  if (bucket) {
    await bucket.put(key, buf, { httpMetadata: { contentType: f.type } });
  } else {
    memoryPhotos.set(key, { buffer: buf, type: f.type });
  }
  return Response.json({ url: '/api/photos?key=' + key });
}

export async function GET(req: Request) {
  const key = new URL(req.url).searchParams.get('key');
  if (!key) return new Response('', { status: 400 });
  const bucket = await getBucket();
  if (bucket) {
    const file = await bucket.get(key);
    if (!file) return new Response('', { status: 404 });
    return new Response(file.body, {
      headers: {
        'Content-Type': file.httpMetadata?.contentType || 'image/jpeg',
        'Cache-Control': 'private, max-age=3600',
        'X-Content-Type-Options': 'nosniff'
      }
    });
  }
  const photo = memoryPhotos.get(key);
  if (!photo) return new Response('', { status: 404 });
  return new Response(photo.buffer, {
    headers: {
      'Content-Type': photo.type,
      'Cache-Control': 'private, max-age=3600',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}
