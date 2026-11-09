// Genera una hoja de contactos (previa) de todas las imágenes de una carpeta, para revisión.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
const [src, out] = process.argv.slice(2);
const files = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (/\.(jpe?g|png)$/i.test(f)) files.push(p); } })(src);
const W = 300, H = 300, cols = 6, rows = Math.ceil(files.length / cols);
const tiles = await Promise.all(files.map(async (f, i) => ({
  input: await sharp(f, { limitInputPixels: false }).rotate().resize(W - 10, H - 30, { fit: 'contain', background: '#fff' }).toBuffer(),
  left: (i % cols) * W + 5, top: Math.floor(i / cols) * H + 5,
})));
const labels = files.map((f, i) => `<text x="${(i % cols) * W + 8}" y="${Math.floor(i / cols) * H + H - 8}" font-size="13" font-family="Arial">${i + 1}. ${path.relative(src, f).replace(/&/g,'&amp;').slice(0, 40)}</text>`).join('');
const svg = Buffer.from(`<svg width="${cols * W}" height="${rows * H}" xmlns="http://www.w3.org/2000/svg">${labels}</svg>`);
await sharp({ create: { width: cols * W, height: rows * H, channels: 3, background: '#fff' } }).composite([...tiles, { input: svg, left: 0, top: 0 }]).jpeg({ quality: 80 }).toFile(out);
files.forEach((f, i) => console.log(i + 1, path.relative(src, f)));
