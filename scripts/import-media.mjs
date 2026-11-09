/**
 * Importa y optimiza las imágenes originales a /public/images.
 *
 *   node scripts/import-media.mjs "<carpeta de proyectos>"
 *
 * - Respeta la estructura de carpetas, pero con nombres "slug" (sin acentos, sin "Copia de", sin numeración).
 * - Genera <nombre>.webp (máx. 2000 px) y <nombre>.thumb.webp (600 px).
 * - Corrige la orientación EXIF. Los originales no se modifican.
 * - Escribe src/data/media.json con ancho/alto de cada imagen.
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = process.argv[2];
if (!src) {
  console.error('Uso: node scripts/import-media.mjs "<carpeta de proyectos>"');
  process.exit(1);
}
const outDir = path.join(root, 'public', 'images');

export const slug = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/^\d+\.\s*/, '') // "2. Nopal chino" -> "nopal chino"
    .replace(/^copia de\s+/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const files = [];
(function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (/\.(jpe?g|png)$/i.test(f)) files.push(p);
  }
})(src);

const manifest = {};
for (const file of files) {
  const rel = path.relative(src, file).split(path.sep);
  const name = slug(path.parse(rel.pop()).name);
  const dir = rel.map(slug).join('/');
  const key = `${dir}/${name}`;
  fs.mkdirSync(path.join(outDir, dir), { recursive: true });

  const img = sharp(file, { limitInputPixels: false }).rotate();
  const full = await img
    .clone()
    .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(path.join(outDir, `${key}.webp`));
  await img
    .clone()
    .resize(600, 600, { fit: 'cover' })
    .webp({ quality: 75 })
    .toFile(path.join(outDir, `${key}.thumb.webp`));

  manifest[key] = { w: full.width, h: full.height };
  console.log(`✓ ${key}  ${full.width}x${full.height}  ${(full.size / 1024).toFixed(0)} KB`);
}

fs.writeFileSync(path.join(root, 'src', 'data', 'media.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`\n${files.length} imágenes -> public/images, manifiesto en src/data/media.json`);
