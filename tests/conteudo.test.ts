import { describe, expect, it } from 'vitest';
import { relacionados, slugCategoria, textoSimples } from '@lib/conteudo';

type Entrada = { id: string; data: { etiquetas: string[]; categoria: string } };
const entrada = (id: string, categoria: string, etiquetas: string[] = []): Entrada => ({
  id,
  data: { categoria, etiquetas },
});

/** As categorias viram endereços em /noticias/categoria/…/ */
describe('slugCategoria', () => {
  it('passa a minúsculas, tira acentos e junta com hífenes', () => {
    expect(slugCategoria('Fim de Semana AM')).toBe('fim-de-semana-am');
    expect(slugCategoria('Associação')).toBe('associacao');
    expect(slugCategoria('Rede ARLA')).toBe('rede-arla');
    expect(slugCategoria('Emergência')).toBe('emergencia');
  });

  it('não deixa hífenes nas pontas nem repetidos', () => {
    expect(slugCategoria('  Geral  ')).toBe('geral');
    expect(slugCategoria('Modos   digitais')).toBe('modos-digitais');
    expect(slugCategoria('— Divulgação —')).toBe('divulgacao');
  });

  it('aguenta pontuação e cardinais sem produzir endereços partidos', () => {
    expect(slugCategoria('Legislação (ANACOM)')).toBe('legislacao-anacom');
    expect(slugCategoria('QO-100')).toBe('qo-100');
    expect(slugCategoria('')).toBe('');
  });

  it('é idempotente: aplicar duas vezes dá o mesmo', () => {
    for (const c of ['Fim de Semana AM', 'Associação', 'Legislação (ANACOM)']) {
      expect(slugCategoria(slugCategoria(c))).toBe(slugCategoria(c));
    }
  });
});

/**
 * Os relacionados aparecem no fim de cada notícia e artigo. A regra é:
 * etiquetas comuns valem 2 pontos, a mesma categoria vale 1, e o que faltar
 * preenche-se com os mais recentes — nunca se mostra menos do que o pedido
 * quando há candidatos.
 */
describe('relacionados', () => {
  const atual = entrada('atual', 'Satélites', ['qo-100', 'sstv']);

  it('não devolve nada quando não há candidatos', () => {
    expect(relacionados(atual, [])).toEqual([]);
  });

  it('nunca inclui o próprio artigo', () => {
    const r = relacionados(atual, [atual, entrada('outro', 'Antenas')]);
    expect(r.map((e) => e.id)).not.toContain('atual');
  });

  it('com um só candidato devolve esse candidato', () => {
    const r = relacionados(atual, [entrada('a', 'Antenas')]);
    expect(r.map((e) => e.id)).toEqual(['a']);
  });

  it('prefere etiquetas comuns à categoria comum', () => {
    const porEtiqueta = entrada('etiqueta', 'Antenas', ['qo-100']);
    const porCategoria = entrada('categoria', 'Satélites', []);
    const r = relacionados(atual, [porCategoria, porEtiqueta], 2);
    expect(r[0].id).toBe('etiqueta');
  });

  it('ordena por número de etiquetas comuns', () => {
    const duas = entrada('duas', 'Antenas', ['qo-100', 'sstv']);
    const uma = entrada('uma', 'Antenas', ['sstv']);
    const r = relacionados(atual, [uma, duas], 2);
    expect(r.map((e) => e.id)).toEqual(['duas', 'uma']);
  });

  it('compara etiquetas sem acentos e sem maiúsculas', () => {
    const comAcento = entrada('acento', 'Antenas', ['Propagação']);
    const base = entrada('base', 'Antenas', ['propagacao']);
    const r = relacionados(base, [comAcento, entrada('nada', 'Geral')], 1);
    expect(r.map((e) => e.id)).toEqual(['acento']);
  });

  it('respeita o número pedido', () => {
    const muitos = Array.from({ length: 10 }, (_, i) => entrada(`n${i}`, 'Satélites'));
    expect(relacionados(atual, muitos, 3)).toHaveLength(3);
    expect(relacionados(atual, muitos, 5)).toHaveLength(5);
  });

  it('completa com os mais recentes quando faltam pontuados', () => {
    // Nenhum partilha etiquetas nem categoria: entram na ordem em que vêm,
    // que é a ordem por data decrescente usada em todo o sítio.
    const r = relacionados(atual, [entrada('a', 'Geral'), entrada('b', 'Geral')], 2);
    expect(r.map((e) => e.id)).toEqual(['a', 'b']);
  });

  it('não repete um artigo já escolhido pela pontuação', () => {
    const pontuado = entrada('pontuado', 'Satélites', ['qo-100']);
    const r = relacionados(atual, [pontuado, entrada('outro', 'Geral')], 2);
    expect(r.map((e) => e.id)).toEqual(['pontuado', 'outro']);
    expect(new Set(r.map((e) => e.id)).size).toBe(r.length);
  });

  it('devolve menos do que o pedido se não houver candidatos suficientes', () => {
    expect(relacionados(atual, [entrada('a', 'Geral')], 3)).toHaveLength(1);
  });
});

/** Texto simples do corpo Markdown — alimenta o tempo de leitura e os excertos. */
describe('textoSimples', () => {
  it('tira blocos de código, imagens e marcações', () => {
    const md = '# Título\n\n```js\nconst x = 1;\n```\n\n![alt](/a.png) **negrito** _itálico_';
    const t = textoSimples(md);
    expect(t).not.toContain('const x');
    expect(t).not.toContain('/a.png');
    expect(t).toContain('negrito');
  });

  it('mantém o texto das ligações e larga o endereço', () => {
    expect(textoSimples('ver os [repetidores](/rede/repetidores/) da ARLA')).toBe(
      'ver os repetidores da ARLA',
    );
  });

  it('devolve cadeia vazia para entrada vazia', () => {
    expect(textoSimples('')).toBe('');
    expect(textoSimples('\n\n   \n')).toBe('');
  });
});
