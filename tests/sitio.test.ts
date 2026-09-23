import { describe, expect, it } from 'vitest';
import { estadoEvento, intervaloDatas, normalizar, tempoLeitura } from '@lib/sitio';

const dia = (iso: string) => new Date(`${iso}T00:00:00Z`);

/**
 * O estado de um evento é calculado, nunca escrito à mão: é o que decide o
 * distintivo («Brevemente», «A decorrer», «Terminado») e se o evento aparece
 * em /eventos/ como futuro ou como passado. A comparação é feita em dias UTC.
 */
describe('estadoEvento', () => {
  it('classifica um evento ainda por acontecer', () => {
    expect(estadoEvento(dia('2026-10-25'), undefined, dia('2026-09-20'))).toBe('futuro');
  });

  it('classifica um evento já terminado', () => {
    expect(estadoEvento(dia('2024-10-25'), undefined, dia('2026-09-20'))).toBe('terminado');
  });

  it('um evento de um só dia está «a decorrer» nesse dia', () => {
    expect(estadoEvento(dia('2026-09-20'), undefined, dia('2026-09-20'))).toBe('adecorrer');
  });

  it('um evento de vários dias está «a decorrer» no primeiro, no meio e no último', () => {
    const inicio = dia('2026-10-24');
    const fim = dia('2026-10-26');
    expect(estadoEvento(inicio, fim, dia('2026-10-24'))).toBe('adecorrer');
    expect(estadoEvento(inicio, fim, dia('2026-10-25'))).toBe('adecorrer');
    expect(estadoEvento(inicio, fim, dia('2026-10-26'))).toBe('adecorrer');
  });

  it('termina no dia seguinte ao fim, não no próprio dia', () => {
    const inicio = dia('2026-10-24');
    const fim = dia('2026-10-26');
    expect(estadoEvento(inicio, fim, dia('2026-10-27'))).toBe('terminado');
    expect(estadoEvento(inicio, fim, dia('2026-10-23'))).toBe('futuro');
  });

  it('ignora a hora: conta o dia inteiro em UTC', () => {
    const inicio = dia('2026-09-20');
    expect(estadoEvento(inicio, undefined, new Date('2026-09-20T23:59:59Z'))).toBe('adecorrer');
    expect(estadoEvento(inicio, undefined, new Date('2026-09-20T00:00:00Z'))).toBe('adecorrer');
    expect(estadoEvento(inicio, undefined, new Date('2026-09-21T00:00:01Z'))).toBe('terminado');
  });

  it('sem data de fim comporta-se como um evento de um dia', () => {
    const inicio = dia('2026-09-20');
    expect(estadoEvento(inicio, undefined, dia('2026-09-21'))).toBe('terminado');
    expect(estadoEvento(inicio, inicio, dia('2026-09-21'))).toBe('terminado');
  });

  it('com fim anterior ao início nunca fica preso em «a decorrer»', () => {
    // Erro de digitação no CMS: o intervalo é vazio, por isso o evento passa
    // de «futuro» a «terminado» sem nunca aparecer como a decorrer.
    const inicio = dia('2026-10-26');
    const fim = dia('2026-10-24');
    expect(estadoEvento(inicio, fim, dia('2026-10-23'))).toBe('futuro');
    expect(estadoEvento(inicio, fim, dia('2026-10-25'))).toBe('futuro');
    expect(estadoEvento(inicio, fim, dia('2026-10-26'))).toBe('terminado');
    expect(estadoEvento(inicio, fim, dia('2026-10-27'))).toBe('terminado');
  });
});

/**
 * O intervalo de datas é o texto visível no cartão e na página de cada evento.
 * Encurta-se sempre que possível, sem nunca perder informação.
 */
describe('intervaloDatas', () => {
  it('sem fim mostra só a data de início', () => {
    expect(intervaloDatas(dia('2024-10-25'))).toBe('25 de outubro de 2024');
  });

  it('início e fim no mesmo dia não se repetem', () => {
    expect(intervaloDatas(dia('2024-10-25'), dia('2024-10-25'))).toBe('25 de outubro de 2024');
  });

  it('dois dias no mesmo mês juntam-se com «e»', () => {
    expect(intervaloDatas(dia('2024-10-25'), dia('2024-10-26'))).toBe(
      '25 e 26 de outubro de 2024',
    );
  });

  it('meses diferentes no mesmo ano repetem o mês mas não o ano', () => {
    expect(intervaloDatas(dia('2024-10-30'), dia('2024-11-02'))).toBe(
      '30 de outubro a 2 de novembro de 2024',
    );
  });

  it('anos diferentes escrevem as duas datas por extenso', () => {
    expect(intervaloDatas(dia('2024-12-30'), dia('2025-01-02'))).toBe(
      '30 de dezembro de 2024 a 2 de janeiro de 2025',
    );
  });

  it('usa os meses em português de Portugal', () => {
    expect(intervaloDatas(dia('2024-03-01'))).toBe('1 de março de 2024');
    expect(intervaloDatas(dia('2024-08-01'))).toBe('1 de agosto de 2024');
  });
});

/** Tempo de leitura estimado, mostrado no cabeçalho de notícias e artigos. */
describe('tempoLeitura', () => {
  it('nunca devolve menos de um minuto', () => {
    expect(tempoLeitura('')).toBe(1);
    expect(tempoLeitura('   ')).toBe(1);
    expect(tempoLeitura('uma palavra')).toBe(1);
  });

  it('conta a 200 palavras por minuto', () => {
    expect(tempoLeitura('palavra '.repeat(200))).toBe(1);
    expect(tempoLeitura('palavra '.repeat(600))).toBe(3);
  });

  it('arredonda para o minuto mais próximo', () => {
    expect(tempoLeitura('palavra '.repeat(250))).toBe(1);
    expect(tempoLeitura('palavra '.repeat(350))).toBe(2);
  });

  it('trata textos muito longos sem estourar', () => {
    expect(tempoLeitura('palavra '.repeat(200_000))).toBe(1000);
  });

  it('não conta espaços, mudanças de linha ou tabulações como palavras', () => {
    expect(tempoLeitura('uma\n\ndois\t\ttrês    quatro')).toBe(1);
    expect(tempoLeitura('a b\nc\td '.repeat(100))).toBe(2);
  });
});

/** Base da pesquisa e da comparação de categorias e etiquetas. */
describe('normalizar', () => {
  it('remove acentos e passa a minúsculas', () => {
    expect(normalizar('Arrábida')).toBe('arrabida');
    expect(normalizar('Associação')).toBe('associacao');
    expect(normalizar('SÃO TIAGO')).toBe('sao tiago');
  });

  it('deixa intacto o que já está normalizado', () => {
    expect(normalizar('repetidores')).toBe('repetidores');
    expect(normalizar('')).toBe('');
  });
});
