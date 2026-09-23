/**
 * Regras de redireção derivadas da fonte única `src/lib/redirects.mjs`.
 *
 * Usado por `scripts/gerar-redirecoes.mjs` (escreve os ficheiros de servidor)
 * e por `scripts/validar-redirecoes.mjs` (verifica que não divergiram).
 */
import { redirects, redirecoesDeFicheiros, capturaFinal } from '../../src/lib/redirects.mjs';

export const MARCA_INICIO = '# >>> INÍCIO DAS REDIREÇÕES GERADAS — não editar à mão';
export const MARCA_FIM = '# <<< FIM DAS REDIREÇÕES GERADAS';

const COMO_REGENERAR = 'npm run redirecoes:gerar';

/**
 * Lista ordenada de todas as regras que os ficheiros de servidor devem conter.
 * A ordem é significativa: as regras específicas vêm antes da recolha final.
 */
export function regras() {
  const rotas = Object.entries(redirects).map(([origem, r]) => ({
    origem,
    destino: r.destination,
    status: r.status ?? 301,
    tipo: 'rota',
  }));
  const ficheiros = Object.entries(redirecoesDeFicheiros).map(([origem, r]) => ({
    origem,
    destino: r.destination,
    status: r.status ?? 301,
    tipo: 'ficheiro',
  }));
  const todas = [...rotas, ...ficheiros].sort((a, b) => a.origem.localeCompare(b.origem, 'en'));
  todas.push({
    origem: capturaFinal.origem,
    destino: capturaFinal.destino,
    status: capturaFinal.status,
    tipo: 'captura',
    padraoApache: capturaFinal.padraoApache,
  });
  return todas;
}

/** Escapa os metacaracteres de regex, para `.pdf` não corresponder a `Xpdf`. */
function escaparRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Padrão Apache de uma regra: caminho sem barra inicial, ancorado nos dois topos. */
export function padraoApache(regra) {
  if (regra.padraoApache) return regra.padraoApache;
  return `^${escaparRegex(regra.origem.replace(/^\//, ''))}$`;
}

/** Bloco de RewriteRule para `public/.htaccess`, sem os marcadores. */
export function blocoHtaccess() {
  const linhas = regras().map(
    (r) => `  RewriteRule ${padraoApache(r)} ${r.destino} [R=${r.status},L]`,
  );
  return linhas.join('\n');
}

/** Conteúdo completo de `public/_redirects` (o ficheiro só tem redireções). */
export function ficheiroRedirects() {
  const linhas = regras().map((r) => `${r.origem}  ${r.destino}  ${r.status}`);
  return [
    '# Redireções do sítio anterior — ver docs/mapa-de-redirecoes.md',
    `# GERADO a partir de src/lib/redirects.mjs por \`${COMO_REGENERAR}\`.`,
    '# Não editar à mão: as alterações perdem-se na próxima geração.',
    ...linhas,
    '',
  ].join('\n');
}

/** Substitui o bloco entre marcadores num `.htaccess` existente. */
export function htaccessComBloco(original) {
  const i = original.indexOf(MARCA_INICIO);
  const f = original.indexOf(MARCA_FIM);
  if (i === -1 || f === -1 || f < i) {
    throw new Error(
      `public/.htaccess não tem os marcadores das redireções geradas.\n` +
        `Esperava encontrar, dentro de <IfModule mod_rewrite.c>:\n` +
        `  ${MARCA_INICIO}\n  …\n  ${MARCA_FIM}`,
    );
  }
  const antes = original.slice(0, i);
  const depois = original.slice(f + MARCA_FIM.length);
  return `${antes}${MARCA_INICIO}\n${blocoHtaccess()}\n  ${MARCA_FIM}${depois}`;
}
