import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const root = new URL('..', import.meta.url);
const pageNames = ['inicio', 'como-funciona', 'explorar-tutores', 'materias', 'ser-tutor', 'iniciar-sesion'];
const sources = await Promise.all(pageNames.map(name => readFile(new URL(`stitch/${name}.html`, root), 'utf8')));
const urls = [...new Set(sources.flatMap(source => [...source.matchAll(/https:\/\/lh3\.googleusercontent\.com\/[^"'\s<>)]+/g)].map(match => match[0])))];
const folder = new URL('public/assets/', root);
await mkdir(folder, { recursive: true });
const manifest = {};
const failures = [];

for (const [index, url] of urls.entries()) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const type = response.headers.get('content-type') || '';
    const ext = type.includes('png') ? 'png' : type.includes('webp') ? 'webp' : 'jpg';
    const hash = createHash('sha256').update(url).digest('hex').slice(0, 12);
    const filename = `stitch-${String(index + 1).padStart(2, '0')}-${hash}.${ext}`;
    await writeFile(new URL(`public/assets/${filename}`, root), Buffer.from(await response.arrayBuffer()));
    manifest[url] = `/assets/${filename}`;
    process.stdout.write(`saved ${index + 1}/${urls.length} ${filename}\n`);
  } catch (error) {
    failures.push({ url, error: String(error) });
    process.stderr.write(`failed ${index + 1}/${urls.length}: ${error}\n`);
  }
}
await writeFile(new URL('assets-manifest.json', root), JSON.stringify(manifest, null, 2));
await writeFile(new URL('assets-failures.json', root), JSON.stringify(failures, null, 2));
process.stdout.write(`Downloaded ${Object.keys(manifest).length}/${urls.length} assets.\n`);
