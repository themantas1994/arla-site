/**
 * Verifica a biblioteca de documentos contra os ficheiros reais (DT-014).
 *
 * O campo `tamanho` de `src/data/documentos.json` é escrito à mão no CMS e
 * ninguém o atualiza quando o PDF é substituído. Isto compara-o com o ficheiro
 * em `public/` e, de caminho, confirma que cada documento existe mesmo.
 *
 * Uso: node scripts/validar-documentos.mjs [--corrigir]
 *   --corrigir  reescreve o campo `tamanho` com o valor real, em vez de falhar.
 */
import { readFile, writeFile, stat } from 'node:fs/promises';
import documentos from '../src/data/documentos.json' with { type: 'json' };

const corrigir = process.argv.includes('--corrigir');
const FICHEIRO = 'src/data/documentos.json';

/** Tamanho no formato usado no sítio: «109 KB», «1.2 MB». */
function formatar(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const problemas = [];
const correcoes = [];
let verificados = 0;

for (const d of documentos.documentos) {
  if (d.externo) continue;
  if (!d.ficheiro?.startsWith('/')) {
    problemas.push(`${d.id}: caminho "${d.ficheiro}" devia começar em "/"`);
    continue;
  }

  const caminho = `public${d.ficheiro}`;
  let info;
  try {
    info = await stat(caminho);
  } catch {
    problemas.push(`${d.id}: ${d.ficheiro} está na lista mas não existe em public/`);
    continue;
  }
  verificados++;

  const real = formatar(info.size);
  if (!d.tamanho) {
    correcoes.push({ id: d.id, de: '(vazio)', para: real });
    problemas.push(`${d.id}: sem tamanho indicado (o ficheiro tem ${real})`);
  } else if (d.tamanho !== real) {
    correcoes.push({ id: d.id, de: d.tamanho, para: real });
    problemas.push(`${d.id}: a lista diz ${d.tamanho}, o ficheiro tem ${real}`);
  }

  const extensao = d.ficheiro.split('.').pop()?.toUpperCase();
  if (d.tipo && extensao && d.tipo.toUpperCase() !== extensao) {
    problemas.push(`${d.id}: tipo "${d.tipo}" não corresponde à extensão .${extensao.toLowerCase()}`);
  }
}

console.log('══ DOCUMENTOS ══');
console.log(`Ficheiros verificados: ${verificados} de ${documentos.documentos.length} na lista`);
console.log('');

if (problemas.length === 0) {
  console.log('✓ Todos os documentos existem e o tamanho publicado está certo.');
  process.exit(0);
}

if (corrigir && correcoes.length) {
  let texto = await readFile(FICHEIRO, 'utf8');
  for (const c of correcoes) {
    if (c.de === '(vazio)') continue;
    texto = texto.replace(`"tamanho": "${c.de}"`, `"tamanho": "${c.para}"`);
    console.log(`  ${c.id}: ${c.de} → ${c.para}`);
  }
  await writeFile(FICHEIRO, texto);
  console.log(`\n✓ ${FICHEIRO} atualizado. Verifique o diff antes de commitar.`);
  process.exit(0);
}

console.log(`✗ ${problemas.length} problemas:`);
for (const p of problemas) console.log(`  ${p}`);
if (correcoes.length) console.log('\nPara corrigir os tamanhos: node scripts/validar-documentos.mjs --corrigir');
process.exit(1);
