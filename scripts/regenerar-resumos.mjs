/**
 * Regenera o campo «resumo» dos conteúdos migrados, saltando saudações e
 * linhas de autoria — que não dizem nada a quem lê um cartão ou um resultado
 * de pesquisa.
 *
 * Usa exclusivamente as palavras do próprio artigo: não acrescenta texto novo.
 * Corre com --escrever para gravar; sem isso, só mostra o que mudaria.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { glob } from 'node:fs/promises';

const escrever = process.argv.includes('--escrever');
const LIMITE = 200;

/**
 * Saudações e linhas de autoria que abrem muitos artigos da ARLA.
 * Os padrões são deliberadamente estreitos: só consomem palavras de saudação,
 * nunca texto que já faça parte da notícia.
 */
const SAUDACAO = String.raw`(?:Prezad[oa]s?(?:\/as)?|Car[oa]s?|Caríssim[oa]s?|Estimad[oa]s?)`;
const DESTINATARIO = String.raw`(?:Colegas?|Amig[oa]s?(?:\/as)?|Associad[oa]s?(?:\/as)?|Sóci[oa]s?|Senhor(?:es|as)?)`;

const ABERTURAS = [
  // «Prezados/as Associados/as, Colegas e Amigos/as,» ou «Caros colegas»
  new RegExp(`^${SAUDACAO}(?:\\s*,?\\s*(?:e\\s+)?${DESTINATARIO})*\\s*[,.:]?\\s+`, 'i'),
  // Resto de uma saudação composta que tenha ficado para trás
  new RegExp(`^${DESTINATARIO}(?:\\s+e\\s+${DESTINATARIO})*\\s*[,.:]\\s*`, 'i'),
  // «por Miguel Pelicano, CT1BYM (associado núm. 71)»
  /^por\s+[A-ZÁÉÍÓÚÂÊÔÃÕÇ][\wÀ-ÿ]*(?:\s+[A-ZÁÉÍÓÚÂÊÔÃÕÇ][\wÀ-ÿ]*)*\s*,?\s*(?:\(?C[TSQ]\d?[A-Z]{1,4}\)?)?\s*(?:\((?:associad[oa] núm\.?\s*\d+)[^)]*\))?\s*/i,
  /^Autor:\s*[^.]+\.\s*/i,
  // Título de secção deixado pelo conversor de HTML
  /^Introdução\s+(?=[A-ZÁÉÍÓÚÂÊÔÃÕÇ])/,
];

function limpar(texto) {
  let t = texto;
  let mudou = true;
  // As aberturas podem estar encadeadas («por Fulano, CT1ABC Introdução …»).
  while (mudou) {
    mudou = false;
    for (const re of ABERTURAS) {
      const novo = t.replace(re, '');
      if (novo !== t) { t = novo; mudou = true; }
    }
  }
  return t.trim();
}

function daCorpo(md) {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s*[-*]{3,}\s*$/gm, ' ')
    .replace(/[#*_>`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncar(t, limite = LIMITE) {
  if (t.length <= limite) return t;
  const corte = t.slice(0, limite);
  // Prefere terminar numa frase completa.
  const ponto = Math.max(corte.lastIndexOf('. '), corte.lastIndexOf('! '), corte.lastIndexOf('? '));
  if (ponto > limite * 0.55) return corte.slice(0, ponto + 1);
  const espaco = corte.lastIndexOf(' ');
  return (espaco > limite * 0.5 ? corte.slice(0, espaco) : corte).replace(/[ ,;:.]+$/, '') + '…';
}

let alterados = 0;
for await (const f of glob('src/content/**/*.md')) {
  const original = await readFile(f, 'utf8');
  const m = original.match(/^resumo: "((?:[^"\\]|\\.)*)"$/m);
  if (!m) continue;
  const atual = m[1].replace(/\\"/g, '"');

  const corpo = original.split(/^---$/m).slice(2).join('---');
  const limpo = limpar(daCorpo(corpo));
  if (!limpo) continue;
  const novo = truncar(limpo);

  // Só substitui quando a limpeza melhorou mesmo alguma coisa.
  if (novo === atual || novo.length < 60) continue;
  const comecavaMal = /^(por |Autor|Prezad|Car[oi]s|Caríssim)/i.test(atual);
  if (!comecavaMal) continue;

  alterados++;
  console.log(`\n${f}`);
  console.log(`  antes: ${atual.slice(0, 110)}`);
  console.log(`  novo : ${novo.slice(0, 110)}`);
  if (escrever) {
    await writeFile(f, original.replace(m[0], `resumo: "${novo.replace(/"/g, '\\"')}"`));
  }
}
console.log(`\n${alterados} resumos ${escrever ? 'atualizados' : 'a atualizar (use --escrever)'}`);
