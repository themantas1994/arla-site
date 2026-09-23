/**
 * Geração de capturas de ecrã — implementação única (DT-007).
 *
 * Antes existiam duas: `scripts/capturas.mjs` (16 páginas) e o bloco
 * `--capturas` de `scripts/qa.mjs` (10 páginas), com regras ligeiramente
 * diferentes e a divergir. Ficou a lista mais completa das duas, que contém
 * todas as páginas e todos os nomes de ficheiro que a outra produzia.
 *
 * Nomes dos ficheiros: `reports/capturas/<nome>-<ecrã>-<tema>.png`.
 */

/**
 * Páginas fotografadas. `inteira` diz se a captura é da página toda ou só do
 * primeiro ecrã (a página inicial é longa e o interessante está no topo).
 */
export const PAGINAS = [
  { nome: 'inicio', rota: '/', inteira: false },
  { nome: 'repetidores', rota: '/rede/repetidores/', inteira: true },
  { nome: 'artigo-tecnico', rota: '/tecnica/qo-100-como-receber/', inteira: true },
  { nome: 'eventos', rota: '/eventos/', inteira: false },
  { nome: 'ser-associado', rota: '/arla/ser-associado/', inteira: true },
  { nome: 'contactos', rota: '/contactos/', inteira: true },
  { nome: 'comecar', rota: '/radioamadorismo/comecar/', inteira: false },
  { nome: 'historia', rota: '/arla/historia/', inteira: false },
  { nome: 'noticias', rota: '/noticias/', inteira: false },
  { nome: 'orgaos-sociais', rota: '/arla/orgaos-sociais/', inteira: true },
  { nome: 'rede', rota: '/rede/', inteira: true },
  { nome: 'mapa-rede', rota: '/rede/mapa/', inteira: false },
  { nome: 'documentos', rota: '/recursos/documentos/', inteira: true },
  { nome: 'faq', rota: '/recursos/faq/', inteira: true },
  { nome: 'pesquisa', rota: '/pesquisa/', inteira: false },
  { nome: '404', rota: '/404.html', inteira: false },
];

export const ECRAS = [
  { largura: 1440, altura: 1000, rotulo: 'desktop' },
  { largura: 768, altura: 1024, rotulo: 'tablet' },
  { largura: 390, altura: 844, rotulo: 'telemovel' },
];

/** Fora do desktop só interessam as páginas onde o layout muda mesmo. */
const EM_ECRA_ESTREITO = new Set(['inicio', 'repetidores', 'contactos', 'eventos', 'noticias']);
/** No tema claro basta confirmar o contraste nas páginas representativas. */
const NO_TEMA_CLARO = new Set(['inicio', 'repetidores', 'artigo-tecnico', 'eventos']);

export const SAIDA = 'reports/capturas';

function interessa(nome, rotulo, tema) {
  if (rotulo !== 'desktop' && !EM_ECRA_ESTREITO.has(nome)) return false;
  if (tema === 'claro' && !NO_TEMA_CLARO.has(nome)) return false;
  return true;
}

/**
 * Fotografa as páginas com um navegador já aberto.
 *
 * @param {import('playwright').Browser} navegador
 * @param {{ base: string, so?: string|null, saida?: string }} opcoes
 * @returns {Promise<number>} quantas capturas foram escritas
 */
export async function capturar(navegador, { base, so = null, saida = SAIDA }) {
  let n = 0;
  for (const { largura, altura, rotulo } of ECRAS) {
    for (const tema of ['escuro', 'claro']) {
      const alvos = PAGINAS.filter(
        (p) => (!so || p.nome === so) && interessa(p.nome, rotulo, tema),
      );
      if (alvos.length === 0) continue;

      const ctx = await navegador.newContext({
        viewport: { width: largura, height: altura },
        ignoreHTTPSErrors: true,
        colorScheme: tema === 'claro' ? 'light' : 'dark',
        deviceScaleFactor: 1,
      });
      const pagina = await ctx.newPage();
      await pagina.addInitScript((t) => {
        try {
          localStorage.setItem('arla-tema', t);
        } catch {
          /* localStorage indisponível: o tema fica o do sistema */
        }
      }, tema);

      for (const p of alvos) {
        await pagina.goto(base + p.rota, { waitUntil: 'networkidle' });
        await pagina.waitForTimeout(450);
        await pagina.screenshot({
          path: `${saida}/${p.nome}-${rotulo}-${tema}.png`,
          fullPage: p.inteira,
        });
        n++;
      }
      await ctx.close();
    }
  }
  return n;
}
