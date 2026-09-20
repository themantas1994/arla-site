/**
 * Conversão de quadrícula Maidenhead (QTH locator) para coordenadas.
 *
 * Devolve o CENTRO da quadrícula, não uma posição exata. A ARLA publica as
 * quadrículas dos seus repetidores e balizas mas não as coordenadas rigorosas,
 * pelo que o mapa assinala sempre posições aproximadas — e diz-o.
 */
export interface Posicao {
  lat: number;
  lon: number;
  /** Raio aproximado da incerteza, em quilómetros. */
  precisaoKm: number;
}

const A = 'A'.charCodeAt(0);

export function quadriculaParaCoordenadas(locator: string): Posicao | null {
  const q = locator.trim().toUpperCase();
  if (!/^[A-R]{2}[0-9]{2}([A-X]{2})?$/.test(q)) return null;

  let lon = (q.charCodeAt(0) - A) * 20 - 180;
  let lat = (q.charCodeAt(1) - A) * 10 - 90;
  lon += Number(q[2]) * 2;
  lat += Number(q[3]) * 1;

  if (q.length === 6) {
    lon += (q.charCodeAt(4) - A) * (2 / 24);
    lat += (q.charCodeAt(5) - A) * (1 / 24);
    // Centro da sub-quadrícula (5' × 2.5')
    return { lat: lat + 1 / 48, lon: lon + 1 / 24, precisaoKm: 4 };
  }
  // Centro da quadrícula de 2° × 1°
  return { lat: lat + 0.5, lon: lon + 1, precisaoKm: 60 };
}

/** Coordenadas em graus e minutos decimais, formato habitual entre radioamadores. */
export function formatarCoordenadas(lat: number, lon: number): string {
  const f = (v: number, pos: string, neg: string) => {
    const h = v >= 0 ? pos : neg;
    const a = Math.abs(v);
    const g = Math.floor(a);
    const m = (a - g) * 60;
    return `${g}°${m.toFixed(2)}'${h}`;
  };
  return `${f(lat, 'N', 'S')} ${f(lon, 'E', 'W')}`;
}
