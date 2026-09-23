/**
 * Gera os ficheiros de redireção do servidor a partir da fonte única
 * `src/lib/redirects.mjs`.
 *
 *   public/.htaccess    — só o bloco entre os marcadores; os cabeçalhos de
 *                         segurança, as regras de cache e o ErrorDocument são
 *                         mantidos à mão e ficam intactos.
 *   public/_redirects   — ficheiro completo (só tem redireções).
 *
 * Uso: node scripts/gerar-redirecoes.mjs [--verificar]
 *   --verificar  não escreve nada; sai com 1 se os ficheiros estiverem
 *                desatualizados. É o que `npm run redirecoes:validar` usa.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { ficheiroRedirects, htaccessComBloco, regras } from './lib/redirecoes.mjs';

const soVerificar = process.argv.includes('--verificar');

const HTACCESS = 'public/.htaccess';
const REDIRECTS = 'public/_redirects';

const htaccessAtual = await readFile(HTACCESS, 'utf8');
const htaccessNovo = htaccessComBloco(htaccessAtual);
const redirectsAtual = await readFile(REDIRECTS, 'utf8').catch(() => '');
const redirectsNovo = ficheiroRedirects();

const desatualizados = [];
if (htaccessAtual !== htaccessNovo) desatualizados.push(HTACCESS);
if (redirectsAtual !== redirectsNovo) desatualizados.push(REDIRECTS);

if (soVerificar) {
  if (desatualizados.length === 0) {
    console.log(`✓ ${HTACCESS} e ${REDIRECTS} estão em dia com src/lib/redirects.mjs.`);
    process.exit(0);
  }
  console.error('✗ Ficheiros de redireção desatualizados:');
  for (const f of desatualizados) console.error(`  ${f}`);
  console.error('\nCorrija com: npm run redirecoes:gerar');
  process.exit(1);
}

if (desatualizados.length === 0) {
  console.log(`✓ Nada a fazer: ${regras().length} regras já estão nos dois ficheiros.`);
  process.exit(0);
}

await writeFile(HTACCESS, htaccessNovo);
await writeFile(REDIRECTS, redirectsNovo);

const porTipo = regras().reduce((c, r) => ({ ...c, [r.tipo]: (c[r.tipo] ?? 0) + 1 }), {});
console.log(`✓ ${regras().length} regras escritas em ${HTACCESS} e ${REDIRECTS}`);
console.log(
  `  ${porTipo.rota ?? 0} de rota · ${porTipo.ficheiro ?? 0} de ficheiro estático · ` +
    `${porTipo.captura ?? 0} de recolha final`,
);
