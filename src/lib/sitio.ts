import sitio from '@data/sitio.json';

export const SITIO = sitio;

/** Endereço de correio eletrónico montado a partir das partes guardadas. */
export const email = () => `${sitio.email.utilizador}@${sitio.email.dominio}`;

/** Versão ofuscada, para mostrar em texto sem alimentar recolhedores de spam. */
export const emailVisivel = () => `${sitio.email.utilizador} (arroba) ${sitio.email.dominio}`;

export const moradaLinhas = [
  sitio.nomeCompleto,
  sitio.morada.linha1,
  sitio.morada.linha2,
  `${sitio.morada.codigoPostal} ${sitio.morada.localidade}`,
  sitio.morada.pais,
].filter(Boolean);

const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

/** Data por extenso em português de Portugal: «9 de novembro de 2024». */
export function dataExtenso(d: Date): string {
  return `${d.getUTCDate()} de ${MESES[d.getUTCMonth()]} de ${d.getUTCFullYear()}`;
}

/** Data curta: «09/11/2024». */
export function dataCurta(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getUTCDate())}/${p(d.getUTCMonth() + 1)}/${d.getUTCFullYear()}`;
}

export function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Intervalo de datas de um evento, sem repetir mês/ano quando coincidem. */
export function intervaloDatas(inicio: Date, fim?: Date): string {
  if (!fim || iso(inicio) === iso(fim)) return dataExtenso(inicio);
  const mesmoAno = inicio.getUTCFullYear() === fim.getUTCFullYear();
  const mesmoMes = mesmoAno && inicio.getUTCMonth() === fim.getUTCMonth();
  if (mesmoMes) {
    return `${inicio.getUTCDate()} e ${fim.getUTCDate()} de ${MESES[fim.getUTCMonth()]} de ${fim.getUTCFullYear()}`;
  }
  if (mesmoAno) {
    return `${inicio.getUTCDate()} de ${MESES[inicio.getUTCMonth()]} a ${fim.getUTCDate()} de ${MESES[fim.getUTCMonth()]} de ${fim.getUTCFullYear()}`;
  }
  return `${dataExtenso(inicio)} a ${dataExtenso(fim)}`;
}

/** Tempo de leitura estimado, a 200 palavras por minuto. */
export function tempoLeitura(texto: string): number {
  const palavras = texto.trim().split(/\s+/).length;
  return Math.max(1, Math.round(palavras / 200));
}

/** Remove acentos e normaliza para comparação/pesquisa em português. */
export function normalizar(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export type EstadoEvento = 'futuro' | 'adecorrer' | 'terminado';

/** Classifica um evento face à data atual. Comparação feita em dias UTC. */
export function estadoEvento(inicio: Date, fim?: Date, agora = new Date()): EstadoEvento {
  const dia = (d: Date) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  const hoje = Date.UTC(agora.getUTCFullYear(), agora.getUTCMonth(), agora.getUTCDate());
  const i = dia(inicio);
  const f = fim ? dia(fim) : i;
  if (hoje < i) return 'futuro';
  if (hoje > f) return 'terminado';
  return 'adecorrer';
}

export const ROTULO_ESTADO_EVENTO: Record<EstadoEvento, string> = {
  futuro: 'Brevemente',
  adecorrer: 'A decorrer',
  terminado: 'Terminado',
};
