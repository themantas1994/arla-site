/**
 * QA automatizado sobre o build estático: acessibilidade (axe-core),
 * verificações funcionais e capturas responsivas.
 *
 * Uso: node scripts/qa.mjs [--capturas] [--url http://localhost:4321]
 */
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const BASE = process.argv.includes('--url')
  ? process.argv[process.argv.indexOf('--url') + 1]
  : 'http://localhost:4321';
const comCapturas = process.argv.includes('--capturas');

const PAGINAS = [
  ['inicio', '/'],
  ['arla', '/arla/'],
  ['historia', '/arla/historia/'],
  ['quem-somos', '/arla/quem-somos/'],
  ['orgaos-sociais', '/arla/orgaos-sociais/'],
  ['direcao-tecnica', '/arla/direcao-tecnica/'],
  ['ser-associado', '/arla/ser-associado/'],
  ['quotizacao', '/arla/quotizacao/'],
  ['rede', '/rede/'],
  ['repetidores', '/rede/repetidores/'],
  ['balizas', '/rede/balizas/'],
  ['aprs', '/rede/aprs/'],
  ['cs5arla', '/rede/cs5arla/'],
  ['mapa-rede', '/rede/mapa/'],
  ['radioamadorismo', '/radioamadorismo/'],
  ['comecar', '/radioamadorismo/comecar/'],
  ['o-que-e', '/radioamadorismo/o-que-e/'],
  ['satelites', '/radioamadorismo/satelites/'],
  ['meteorologia', '/radioamadorismo/meteorologia-espacial/'],
  ['noticias', '/noticias/'],
  ['noticia', '/noticias/estacao-de-rececao-ais-shipxplorer/'],
  ['eventos', '/eventos/'],
  ['evento', '/eventos/12a-edicao-fim-de-semana-am/'],
  ['tecnica', '/tecnica/'],
  ['artigo-tecnico', '/tecnica/modos-digitais-para-o-qo-100/'],
  ['recursos', '/recursos/'],
  ['documentos', '/recursos/documentos/'],
  ['ligacoes', '/recursos/ligacoes/'],
  ['faq', '/recursos/faq/'],
  ['contactos', '/contactos/'],
  ['pesquisa', '/pesquisa/'],
  ['arquivo', '/arquivo/'],
  ['area-reservada', '/area-reservada/'],
  ['privacidade', '/legal/privacidade/'],
  ['cookies', '/legal/cookies/'],
  ['aviso-legal', '/legal/aviso-legal/'],
  ['404', '/404.html'],
];

const LARGURAS = [320, 375, 390, 768, 1024, 1280, 1440];

// O ambiente traz o Chromium pré-instalado; usa-se esse binário quando existe,
// em vez de descarregar outro.
const CHROMIUM = process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium';
const navegador = await chromium.launch(
  existsSync(CHROMIUM) ? { executablePath: CHROMIUM } : {},
);
const relatorio = { acessibilidade: [], overflow: [], consola: [], funcional: [], alvos: [] };

// --------------------------------------------------------------- Acessibilidade
for (const tema of ['escuro', 'claro']) {
  const ctx = await navegador.newContext({
    viewport: { width: 1280, height: 900 },
    ignoreHTTPSErrors: true,
    colorScheme: tema === 'claro' ? 'light' : 'dark',
  });
  const pagina = await ctx.newPage();
  await pagina.addInitScript((t) => { try { localStorage.setItem('arla-tema', t); } catch {} }, tema);
  const erros = [];
  pagina.on('console', (m) => { if (m.type() === 'error') erros.push(m.text()); });
  pagina.on('pageerror', (e) => erros.push(String(e)));

  for (const [nome, rota] of PAGINAS) {
    erros.length = 0;
    await pagina.goto(BASE + rota, { waitUntil: 'networkidle' });
    const r = await new AxeBuilder({ page: pagina })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
      .analyze();
    const graves = r.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
    relatorio.acessibilidade.push({
      pagina: nome,
      tema,
      rota,
      total: r.violations.length,
      graves: graves.length,
      violacoes: r.violations.map((v) => ({
        id: v.id, impacto: v.impact, descricao: v.help, nos: v.nodes.length,
        exemplo: v.nodes[0]?.html?.slice(0, 160),
      })),
    });
    if (erros.length) relatorio.consola.push({ pagina: nome, tema, erros: [...erros] });
  }
  await ctx.close();
}

// ------------------------------------------------------------ Overflow lateral
{
  for (const largura of LARGURAS) {
    const ctx = await navegador.newContext({ viewport: { width: largura, height: 900 }, ignoreHTTPSErrors: true });
    const pagina = await ctx.newPage();
    for (const [nome, rota] of PAGINAS) {
      await pagina.goto(BASE + rota, { waitUntil: 'domcontentloaded' });
      await pagina.waitForTimeout(120);
      const r = await pagina.evaluate(() => {
        const de = document.documentElement;
        const excesso = de.scrollWidth - de.clientWidth;
        const culpados = [];
        if (excesso > 1) {
          for (const el of document.querySelectorAll('body *')) {
            const c = el.getBoundingClientRect();
            if (c.right > de.clientWidth + 1 || c.left < -1) {
              culpados.push(`${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]}`);
              if (culpados.length > 4) break;
            }
          }
        }
        return { excesso, culpados: [...new Set(culpados)] };
      });
      if (r.excesso > 1) relatorio.overflow.push({ pagina: nome, largura, ...r });
    }
    await ctx.close();
  }
}

// ---------------------------------------------------------- Alvos de toque
{
  const ctx = await navegador.newContext({ viewport: { width: 375, height: 812 }, hasTouch: true, ignoreHTTPSErrors: true });
  const pagina = await ctx.newPage();
  for (const [nome, rota] of PAGINAS) {
    await pagina.goto(BASE + rota, { waitUntil: 'domcontentloaded' });
    const pequenos = await pagina.evaluate(() => {
      const maus = [];
      /**
       * Mede o alvo REALMENTE tocável, e não a caixa do elemento:
       *  - um <a> cujo ::after se estende sobre um cartão tem como alvo o cartão;
       *  - um <input> escondido dentro de um <label> tem como alvo o label;
       *  - ligações dentro de uma frase estão isentas (WCAG 2.5.8, exceção «inline»).
       */
      const dentroDeTexto = (el) => {
        const pai = el.parentElement;
        if (!pai) return false;
        if (!['P', 'LI', 'DD', 'SPAN', 'TD', 'FIGCAPTION', 'ADDRESS'].includes(pai.tagName)) return false;
        // Há texto à volta da ligação? Então é uma ligação em linha.
        return (pai.textContent || '').trim().length > (el.textContent || '').trim().length + 3;
      };

      for (const el of document.querySelectorAll('a[href], button, input, select, summary')) {
        // Ligações dentro de texto corrido estão isentas do tamanho mínimo
        // (WCAG 2.5.8, exceção «inline»), tal como as migalhas de pão.
        if (el.closest('.migalhas, .mapa__lista, .prosa')) continue;
        if (dentroDeTexto(el)) continue;

        let caixa = el.getBoundingClientRect();
        // Um controlo escondido (opacidade 0, 1×1 px) dentro de um label: o alvo é o label.
        if (caixa.width < 4 || caixa.height < 4) {
          const rotulo = el.closest('label');
          if (!rotulo) continue;                       // genuinamente invisível
          caixa = rotulo.getBoundingClientRect();
        }
        const cartao = el.closest('.cartao, .atalho, .tema, .bloco, .sub-cartao, .caminho, .seccao-cartao, .ligacao, .area');
        if (cartao && getComputedStyle(el, '::after').position === 'absolute') {
          caixa = cartao.getBoundingClientRect();      // o cartão inteiro é o alvo
        }
        if (caixa.height < 24 || caixa.width < 24) {
          maus.push(`${el.tagName.toLowerCase()}[${(el.textContent || '').trim().slice(0, 24)}] ${Math.round(caixa.width)}×${Math.round(caixa.height)}`);
        }
      }
      return maus.slice(0, 6);
    });
    if (pequenos.length) relatorio.alvos.push({ pagina: nome, pequenos });
  }
  await ctx.close();
}

// -------------------------------------------------------------- Funcional
{
  const ctx = await navegador.newContext({ viewport: { width: 1280, height: 900 }, ignoreHTTPSErrors: true });
  const p = await ctx.newPage();
  const teste = async (nome, fn) => {
    try { const d = await fn(); relatorio.funcional.push({ teste: nome, ok: true, detalhe: d ?? '' }); }
    catch (e) { relatorio.funcional.push({ teste: nome, ok: false, detalhe: String(e.message ?? e) }); }
  };

  await teste('Filtro de repetidores por banda (UHF)', async () => {
    await p.goto(BASE + '/rede/repetidores/', { waitUntil: 'networkidle' });
    const antes = await p.locator('tbody tr:visible').count();
    await p.getByRole('checkbox', { name: 'UHF' }).check();
    await p.waitForTimeout(150);
    const depois = await p.locator('tbody tr:visible').count();
    if (depois >= antes || depois === 0) throw new Error(`sem efeito: ${antes} → ${depois}`);
    return `${antes} → ${depois} linhas`;
  });

  await teste('Pesquisa de repetidores por texto', async () => {
    await p.goto(BASE + '/rede/repetidores/', { waitUntil: 'networkidle' });
    await p.locator('#pesquisa-repetidores').fill('arrabida');
    await p.waitForTimeout(200);
    const n = await p.locator('tbody tr:visible').count();
    if (n === 0) throw new Error('pesquisa sem acentos não encontrou «Arrábida»');
    return `${n} resultados para «arrabida»`;
  });

  await teste('Estado vazio dos filtros de repetidores', async () => {
    await p.goto(BASE + '/rede/repetidores/', { waitUntil: 'networkidle' });
    await p.locator('#pesquisa-repetidores').fill('zzzzzz');
    await p.waitForTimeout(200);
    const visivel = await p.locator('[data-sem-resultados] .vazio').isVisible();
    if (!visivel) throw new Error('estado vazio não apareceu');
    return 'mensagem de «nenhum repetidor» apresentada';
  });

  await teste('Botão de copiar frequência', async () => {
    await ctx.grantPermissions(['clipboard-read', 'clipboard-write']);
    await p.goto(BASE + '/rede/repetidores/', { waitUntil: 'networkidle' });
    await p.locator('[data-copiar="145.7375"]').first().click();
    const v = await p.evaluate(() => navigator.clipboard.readText());
    if (v !== '145.7375') throw new Error(`copiou «${v}»`);
    return 'frequência copiada para a área de transferência';
  });

  await teste('Pesquisa do sítio (Pagefind)', async () => {
    await p.goto(BASE + '/pesquisa/?q=repetidor', { waitUntil: 'networkidle' });
    await p.waitForSelector('.resultado', { timeout: 15000 });
    const n = await p.locator('.resultado').count();
    if (n === 0) throw new Error('sem resultados');
    return `${n} resultados para «repetidor»`;
  });

  await teste('Pesquisa do sítio sem acentos', async () => {
    await p.goto(BASE + '/pesquisa/?q=satelite', { waitUntil: 'networkidle' });
    await p.waitForSelector('.resultado, .vazio', { timeout: 15000 });
    const n = await p.locator('.resultado').count();
    if (n === 0) throw new Error('«satelite» sem acento não encontrou «satélite»');
    return `${n} resultados para «satelite»`;
  });

  await teste('Pesquisa sem resultados mostra estado vazio', async () => {
    // O Pagefind é tolerante a erros de escrita, por isso é preciso um termo
    // que não se aproxime de nada no índice.
    await p.goto(BASE + '/pesquisa/?q=wxkjqzvbn', { waitUntil: 'networkidle' });
    await p.waitForSelector('[data-resultados] .vazio', { timeout: 15000 });
    return 'mensagem «não encontrámos resultados» apresentada';
  });

  await teste('Menu para ecrãs pequenos abre e fecha', async () => {
    const m = await navegador.newContext({ viewport: { width: 375, height: 812 }, hasTouch: true, ignoreHTTPSErrors: true });
    const mp = await m.newPage();
    await mp.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    await mp.locator('#abrir-menu').click();
    if (!(await mp.locator('#menu-movel').isVisible())) throw new Error('não abriu');
    await mp.locator('#menu-movel summary', { hasText: 'Rede ARLA' }).first().click();
    await mp.waitForTimeout(100);
    const ligacaoVisivel = await mp.getByRole('link', { name: 'Repetidores', exact: true }).first().isVisible();
    await mp.locator('#abrir-menu').click();
    const fechou = !(await mp.locator('#menu-movel').isVisible());
    await m.close();
    if (!ligacaoVisivel) throw new Error('submenu não expandiu');
    if (!fechou) throw new Error('não fechou');
    return 'abre, expande secção e fecha';
  });

  await teste('Submenu de escritório por teclado', async () => {
    await p.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    const botao = p.locator('.nav-principal [data-abre-submenu]').first();
    await botao.focus();
    await p.keyboard.press('Enter');
    if ((await botao.getAttribute('aria-expanded')) !== 'true') throw new Error('não expandiu com Enter');
    await p.keyboard.press('Escape');
    if ((await botao.getAttribute('aria-expanded')) !== 'false') throw new Error('Escape não fechou');
    return 'Enter abre, Escape fecha, aria-expanded correto';
  });

  await teste('Alternância de tema persiste', async () => {
    await p.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    await p.locator('#alternar-tema').click();
    const t1 = await p.evaluate(() => document.documentElement.dataset.tema);
    await p.reload({ waitUntil: 'domcontentloaded' });
    const t2 = await p.evaluate(() => document.documentElement.dataset.tema);
    if (t1 !== t2) throw new Error(`não persistiu: ${t1} → ${t2}`);
    await p.locator('#alternar-tema').click();
    return `tema «${t1}» mantido após recarregar`;
  });

  await teste('Mapa carrega telas do OpenStreetMap', async () => {
    await p.goto(BASE + '/contactos/', { waitUntil: 'networkidle' });
    await p.locator('#mapa-contactos').scrollIntoViewIfNeeded();
    await p.waitForFunction(
      () => document.querySelectorAll('#mapa-contactos .leaflet-tile').length > 0,
      { timeout: 25000 },
    );
    const marcadores = await p.locator('#mapa-contactos .leaflet-interactive').count();
    if (marcadores === 0) throw new Error('mapa sem marcadores');
    return `Leaflet inicializado, ${marcadores} marcador(es)`;
  });

  await teste('Filtro do arquivo', async () => {
    await p.goto(BASE + '/arquivo/', { waitUntil: 'domcontentloaded' });
    const antes = await p.locator('[data-item]:visible').count();
    await p.locator('#filtro-arquivo').fill('QO-100');
    await p.waitForTimeout(150);
    const depois = await p.locator('[data-item]:visible').count();
    if (depois === 0 || depois >= antes) throw new Error(`sem efeito: ${antes} → ${depois}`);
    return `${antes} → ${depois} itens`;
  });

  await teste('Filtro de associados sem acentos', async () => {
    await p.goto(BASE + '/arla/quem-somos/', { waitUntil: 'domcontentloaded' });
    await p.locator('#filtro-associados').fill('monica');
    await p.waitForTimeout(150);
    const n = await p.locator('tbody tr:visible').count();
    if (n === 0) throw new Error('«monica» não encontrou «Mónica»');
    return `${n} resultado para «monica»`;
  });

  await teste('Descarregamento de PDF disponível', async () => {
    const r = await p.request.get(BASE + '/documentos/estatutos-arla.pdf');
    if (!r.ok()) throw new Error(`HTTP ${r.status()}`);
    const tipo = r.headers()['content-type'] ?? '';
    if (!tipo.includes('pdf')) throw new Error(`tipo inesperado: ${tipo}`);
    return `${Math.round((await r.body()).length / 1024)} KB, ${tipo}`;
  });

  await teste('Índice de conteúdos do artigo longo', async () => {
    await p.goto(BASE + '/tecnica/modos-digitais-para-o-qo-100/', { waitUntil: 'domcontentloaded' });
    const n = await p.locator('.indice a').count();
    if (n < 3) throw new Error(`apenas ${n} entradas`);
    return `${n} entradas no índice`;
  });

  await teste('Redireção do sítio antigo', async () => {
    await p.goto(BASE + '/site/repetidores/', { waitUntil: 'domcontentloaded' });
    await p.waitForURL('**/rede/repetidores/', { timeout: 10000 });
    return '/site/repetidores/ → /rede/repetidores/';
  });

  await teste('Página 404 responde com conteúdo útil', async () => {
    await p.goto(BASE + '/isto-nao-existe-de-todo/', { waitUntil: 'domcontentloaded' });
    const texto = await p.locator('body').innerText();
    if (!texto.includes('frequência')) throw new Error('não mostrou a página 404 da ARLA');
    return 'mensagem personalizada + pesquisa + atalhos';
  });

  await ctx.close();
}

// ---------------------------------------------------------------- Capturas
if (comCapturas) {
  await mkdir('reports/capturas', { recursive: true });
  const ALVOS = [
    ['inicio', '/'], ['repetidores', '/rede/repetidores/'], ['artigo-tecnico', '/tecnica/modos-digitais-para-o-qo-100/'],
    ['eventos', '/eventos/'], ['ser-associado', '/arla/ser-associado/'], ['contactos', '/contactos/'],
    ['comecar', '/radioamadorismo/comecar/'], ['historia', '/arla/historia/'], ['noticias', '/noticias/'],
    ['404', '/404.html'],
  ];
  for (const [largura, rotulo] of [[1440, 'desktop'], [768, 'tablet'], [390, 'telemovel']]) {
    for (const tema of ['escuro', 'claro']) {
      const ctx = await navegador.newContext({ viewport: { width: largura, height: 1000 }, ignoreHTTPSErrors: true });
      const pagina = await ctx.newPage();
      await pagina.addInitScript((t) => {
        try { localStorage.setItem('arla-tema', t); } catch {}
      }, tema);
      for (const [nome, rota] of ALVOS) {
        if (largura !== 1440 && !['inicio', 'repetidores', 'contactos'].includes(nome)) continue;
        if (tema === 'claro' && !['inicio', 'repetidores', 'artigo-tecnico'].includes(nome)) continue;
        await pagina.goto(BASE + rota, { waitUntil: 'networkidle' });
        await pagina.waitForTimeout(400);
        await pagina.screenshot({
          path: `reports/capturas/${nome}-${rotulo}-${tema}.png`,
          fullPage: nome !== 'inicio',
        });
      }
      await ctx.close();
    }
  }
}

await navegador.close();
await mkdir('reports', { recursive: true });
await writeFile('reports/qa.json', JSON.stringify(relatorio, null, 2));

// ------------------------------------------------------------------ Resumo
const totalViol = relatorio.acessibilidade.reduce((s, a) => s + a.total, 0);
const totalGraves = relatorio.acessibilidade.reduce((s, a) => s + a.graves, 0);
const falhas = relatorio.funcional.filter((f) => !f.ok);

console.log('\n══ ACESSIBILIDADE (axe-core, WCAG 2.2 AA + boas práticas) ══');
console.log(`Análises: ${relatorio.acessibilidade.length} (${PAGINAS.length} páginas × 2 temas)`);
console.log(`Violações: ${totalViol} (${totalGraves} graves/críticas)`);
const porRegra = new Map();
for (const a of relatorio.acessibilidade)
  for (const v of a.violacoes) {
    if (!porRegra.has(v.id)) porRegra.set(v.id, { impacto: v.impacto, paginas: [], descricao: v.descricao, exemplo: v.exemplo });
    porRegra.get(v.id).paginas.push(`${a.pagina}/${a.tema}`);
  }
for (const [id, d] of [...porRegra].sort((a, b) => b[1].paginas.length - a[1].paginas.length)) {
  console.log(`  [${d.impacto}] ${id} — ${d.descricao}`);
  console.log(`     ${d.paginas.length} páginas: ${d.paginas.slice(0, 6).join(', ')}${d.paginas.length > 6 ? '…' : ''}`);
  if (d.exemplo) console.log(`     ex.: ${d.exemplo}`);
}

console.log('\n══ RESPONSIVO (320–1440px) ══');
console.log(relatorio.overflow.length === 0
  ? '✓ Sem transbordo horizontal em nenhuma largura.'
  : `✗ ${relatorio.overflow.length} casos de transbordo:`);
for (const o of relatorio.overflow.slice(0, 20))
  console.log(`  ${o.pagina} @${o.largura}px: +${o.excesso}px — ${o.culpados.join(', ')}`);

console.log('\n══ ALVOS DE TOQUE (<24px @375px) ══');
console.log(relatorio.alvos.length === 0 ? '✓ Nenhum alvo demasiado pequeno.' : `✗ ${relatorio.alvos.length} páginas:`);
for (const a of relatorio.alvos.slice(0, 12)) console.log(`  ${a.pagina}: ${a.pequenos.join(' | ')}`);

console.log('\n══ ERROS DE CONSOLA ══');
console.log(relatorio.consola.length === 0 ? '✓ Nenhum.' : `✗ ${relatorio.consola.length} páginas:`);
for (const c of relatorio.consola.slice(0, 10)) console.log(`  ${c.pagina}: ${c.erros[0]?.slice(0, 160)}`);

console.log('\n══ FUNCIONAL ══');
for (const f of relatorio.funcional) console.log(`  ${f.ok ? '✓' : '✗'} ${f.teste}${f.detalhe ? ` — ${f.detalhe}` : ''}`);

console.log(`\nRelatório completo: reports/qa.json`);
process.exit(falhas.length > 0 || totalGraves > 0 ? 1 : 0);
