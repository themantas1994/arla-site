import { describe, expect, it } from 'vitest';
import { formatarCoordenadas, quadriculaParaCoordenadas } from '@lib/maidenhead';

/**
 * A quadrícula Maidenhead é o que a ARLA publica dos seus repetidores e
 * balizas; o mapa depende inteiramente desta conversão. Um erro aqui move
 * marcadores sem partir nada, por isso os casos abaixo fixam valores conhecidos.
 */
describe('quadriculaParaCoordenadas', () => {
  it('converte a quadrícula da sede (IM58pa) para perto das coordenadas reais', () => {
    const p = quadriculaParaCoordenadas('IM58pa');
    expect(p).not.toBeNull();
    expect(p!.lat).toBeCloseTo(38.0208, 3);
    expect(p!.lon).toBeCloseTo(-8.7083, 3);
    expect(p!.precisaoKm).toBe(4);

    // As coordenadas exatas da sede estão em src/data/sitio.json; o centro da
    // quadrícula tem de cair dentro da precisão anunciada (~4 km ≈ 0,04°).
    expect(Math.abs(p!.lat - 38.017372)).toBeLessThan(0.04);
    expect(Math.abs(p!.lon - -8.695195)).toBeLessThan(0.04);
  });

  it('devolve o centro da quadrícula, não o canto', () => {
    // IM58 sozinha cobre 2° × 1°: o centro fica a meio de cada eixo.
    const p = quadriculaParaCoordenadas('IM58')!;
    expect(p.lat).toBeCloseTo(38.5, 6);
    expect(p.lon).toBeCloseTo(-9, 6);
    expect(p.precisaoKm).toBe(60);
  });

  it('a sub-quadrícula cai dentro da quadrícula que a contém', () => {
    const grande = quadriculaParaCoordenadas('IM58')!;
    const pequena = quadriculaParaCoordenadas('IM58pa')!;
    expect(Math.abs(pequena.lat - grande.lat)).toBeLessThanOrEqual(0.5);
    expect(Math.abs(pequena.lon - grande.lon)).toBeLessThanOrEqual(1);
  });

  it('assume precisão diferente conforme o comprimento', () => {
    expect(quadriculaParaCoordenadas('IM58')!.precisaoKm).toBe(60);
    expect(quadriculaParaCoordenadas('IM58pa')!.precisaoKm).toBe(4);
  });

  it('quadrículas vizinhas dão posições distintas e na ordem certa', () => {
    const oeste = quadriculaParaCoordenadas('IM57px')!;
    const este = quadriculaParaCoordenadas('IM58pa')!;
    expect(este.lat).toBeGreaterThan(oeste.lat);
  });

  it('aceita minúsculas e espaços em redor', () => {
    const a = quadriculaParaCoordenadas('  im58pa ')!;
    const b = quadriculaParaCoordenadas('IM58PA')!;
    expect(a).toEqual(b);
  });

  it('cobre os extremos válidos do sistema', () => {
    const sudoeste = quadriculaParaCoordenadas('AA00')!;
    expect(sudoeste.lat).toBeCloseTo(-89.5, 6);
    expect(sudoeste.lon).toBeCloseTo(-179, 6);

    const nordeste = quadriculaParaCoordenadas('RR99')!;
    expect(nordeste.lat).toBeCloseTo(89.5, 6);
    expect(nordeste.lon).toBeCloseTo(179, 6);
  });

  it('nunca sai do intervalo de coordenadas legítimo', () => {
    for (const q of ['AA00', 'RR99', 'AR09', 'RA90', 'IM58pa', 'AA00aa', 'RR99xx']) {
      const p = quadriculaParaCoordenadas(q)!;
      expect(p.lat).toBeGreaterThanOrEqual(-90);
      expect(p.lat).toBeLessThanOrEqual(90);
      expect(p.lon).toBeGreaterThanOrEqual(-180);
      expect(p.lon).toBeLessThanOrEqual(180);
    }
  });

  it.each([
    ['', 'vazio'],
    ['IM', 'só o campo'],
    ['IM5', 'quadrado incompleto'],
    ['IM58p', 'sub-quadrícula incompleta'],
    ['IM58pax', 'caracteres a mais'],
    ['SS58pa', 'campo fora de A–R'],
    ['IM58py', 'sub-quadrícula fora de A–X'],
    ['I358pa', 'letra onde tem de haver letra'],
    ['IMAB', 'dígitos onde tem de haver dígitos'],
    ['IM 58pa', 'espaço no meio'],
  ])('rejeita %s (%s) em vez de devolver coordenadas erradas', (q) => {
    expect(quadriculaParaCoordenadas(q)).toBeNull();
  });
});

describe('formatarCoordenadas', () => {
  it('usa graus e minutos decimais com os hemisférios certos', () => {
    expect(formatarCoordenadas(38.0208, -8.7083)).toBe("38°1.25'N 8°42.50'W");
    expect(formatarCoordenadas(-38.0208, 8.7083)).toBe("38°1.25'S 8°42.50'E");
  });

  it('trata o zero como norte/este, não como negativo', () => {
    expect(formatarCoordenadas(0, 0)).toBe("0°0.00'N 0°0.00'E");
  });
});
