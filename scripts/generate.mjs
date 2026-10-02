import { readFile, writeFile, mkdir } from 'node:fs/promises';

const root = new URL('..', import.meta.url);
const routes = {
  inicio: '/',
  'como-funciona': '/como-funciona/',
  'explorar-tutores': '/explorar-tutores/',
  materias: '/materias/',
  'ser-tutor': '/ser-tutor/',
  'iniciar-sesion': '/iniciar-sesion/'
};
const titles = {
  inicio: 'TutorMayor — Entre pares, todo hace clic',
  'como-funciona': 'Cómo funciona — TutorMayor',
  'explorar-tutores': 'Explorar tutores — TutorMayor',
  materias: 'Materias y cátedras — TutorMayor',
  'ser-tutor': 'Ser tutor — TutorMayor',
  'iniciar-sesion': 'Iniciar sesión — TutorMayor'
};
const assetManifest = JSON.parse(await readFile(new URL('assets-manifest.json', root), 'utf8'));
const palettes = [];

function rgb(hex) {
  return [1, 3, 5].map(index => Number.parseInt(hex.slice(index, index + 2), 16)).join(' ');
}

function linkRoutes(html) {
  return html.replace(/<a\b[^>]*>/g, tag => {
    const path = tag.match(/data-path="([^"]+)"/)?.[1];
    const route = routes[path];
    return route ? tag.replace(/href="[^"]*"/, `href="${route}"`) : tag;
  });
}

function cleanMarkup(html, name) {
  let clean = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  for (const [remote, local] of Object.entries(assetManifest)) clean = clean.replaceAll(remote, local);
  clean = linkRoutes(clean);
  clean = clean.replace(/<a\b([^>]*href="#"[^>]*)>([\s\S]*?)<\/a>/g, (whole, attrs, content) => {
    const label = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const target = /Postularme como Tutor|Quiero ser tutor/.test(label) ? '/ser-tutor/' : /Buscar mi tutor/.test(label) ? '/explorar-tutores/' : null;
    return target ? `<a${attrs.replace('href="#"', `href="${target}"`)}>${content}</a>` : whole;
  });
  clean = clean.replace(/onclick="filterCategory\('([^']+)'\)"/g, 'data-action="filter-category" data-category="$1"');
  clean = clean.replace(/onclick="filterTutors\(\)"/g, 'data-action="filter-tutors"');
  clean = clean.replace(/onclick="switchRole\('([^']+)'\)"/g, 'data-action="switch-role" data-role="$1"');
  clean = clean.replace(/onclick="toggleFaq\((\d+)\)"/g, 'data-action="toggle-faq" data-index="$1"');
  clean = clean.replace(/onclick="setHoras\((\d+)\)"/g, 'data-action="set-horas" data-value="$1"');
  clean = clean.replace(/onclick="setTarifa\((\d+)\)"/g, 'data-action="set-tarifa" data-value="$1"');
  clean = clean.replace(/onsubmit="[^"]*"/g, '');
  clean = clean.replace(/\s+on[a-z]+="[^"]*"/gi, '');
  clean = clean.replace(/<img\b[^>]*>/g, tag => {
    const description = tag.match(/data-alt="([^"]*)"/)?.[1];
    let updated = tag.replace(/\s+data-alt="[^"]*"/, '');
    if (!/\balt=/.test(updated)) updated = updated.replace('<img', `<img alt="${description || ''}"`);
    return updated;
  });
  if (name === 'ser-tutor') clean = clean.replace(/<form\b/, '<form data-form="postulacion"');
  if (name === 'materias') clean = clean.replace(/<form\b/, '<form data-form="subject-request"');
  if (name === 'iniciar-sesion') clean = clean.replace(/<form\b/, '<form data-form="login"');
  if (name === 'como-funciona') {
    clean = clean.replace(/(<h2[^>]*)(>\s*Preguntas Frecuentes)/, '$1 id="preguntas-frecuentes"$2');
    clean = clean.replace(/(<h2[^>]*)(>\s*Tu tranquilidad académica)/, '$1 id="garantia"$2');
  }
  if (name === 'materias') clean = clean.replace(/(<h2[^>]*)(>\s*¿Tu materia es demasiado)/, '$1 id="solicitud"$2');
  return clean;
}

const htmlShell = (name) => `<!doctype html>
<html lang="es"><head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#21152B" />
  <meta name="description" content="TutorMayor conecta estudiantes universitarios para aprender y enseñar entre pares." />
  <title>${titles[name]}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Sora:wght@500;600;700&family=Space+Grotesk:wght@600;700&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
  <link href="/style.css" rel="stylesheet" />
</head><body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body></html>`;

for (const name of Object.keys(routes)) {
  const source = await readFile(new URL(`stitch/${name}.html`, root), 'utf8');
  const main = source.match(/<main\b[^>]*>[\s\S]*?<\/main>/i)?.[0];
  if (!main) throw new Error(`Missing main element in ${name}`);
  await writeFile(new URL(`src/pages/${name}.html`, root), cleanMarkup(main, name));
  const colorBlock = source.match(/["']?colors["']?\s*:\s*\{([\s\S]*?)\}\s*,\s*["']?borderRadius/i)?.[1];
  if (!colorBlock) throw new Error(`Missing color tokens in ${name}`);
  const colors = [...colorBlock.matchAll(/(?:"([\w-]+)"|([\w-]+))\s*:\s*"(#[0-9a-fA-F]{6})"/g)];
  palettes.push(`[data-page="${name}"] {\n${colors.map(m => `  --c-${m[1] || m[2]}: ${rgb(m[3])};`).join('\n')}\n}`);
  const output = name === 'inicio' ? new URL('index.html', root) : new URL(`${name}/index.html`, root);
  if (name !== 'inicio') await mkdir(new URL(`${name}/`, root), {recursive: true});
  await writeFile(output, htmlShell(name));
}
await writeFile(new URL('src/palettes.css', root), palettes.join('\n\n') + '\n');
