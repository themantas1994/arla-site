/**
 * Otimiza as imagens migradas do sítio anterior:
 * redimensiona para 1600px de largura máxima e reencodifica.
 * Corre uma vez sobre public/imagens; é idempotente (ignora o que já é pequeno).
 */
import { readdir, stat, rename, unlink } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const DIR = process.argv[2] ?? 'public/imagens/conteudo';
const MAX = 1600;
let poupado = 0, tratadas = 0;

for (const nome of await readdir(DIR)) {
  const p = path.join(DIR, nome);
  const ext = path.extname(nome).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;
  const antes = (await stat(p)).size;
  const img = sharp(p, { failOn: 'none' });
  const meta = await img.metadata();
  const precisaRedim = (meta.width ?? 0) > MAX;
  if (!precisaRedim && antes < 220_000) continue;

  const tmp = p + '.tmp';
  let pipe = img.rotate();
  if (precisaRedim) pipe = pipe.resize({ width: MAX, withoutEnlargement: true });
  pipe = ext === '.png'
    ? pipe.png({ compressionLevel: 9, palette: true, quality: 88 })
    : pipe.jpeg({ quality: 82, mozjpeg: true, progressive: true });
  await pipe.toFile(tmp);

  const depois = (await stat(tmp)).size;
  if (depois < antes) {
    await rename(tmp, p);
    poupado += antes - depois;
    tratadas++;
  } else {
    await unlink(tmp);
  }
}
console.log(`${tratadas} imagens otimizadas, ${(poupado / 1e6).toFixed(1)} MB poupados`);
