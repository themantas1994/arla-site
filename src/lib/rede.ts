import { getCollection } from 'astro:content';
import { quadriculaParaCoordenadas } from './maidenhead';
import type { Marcador } from '@components/Mapa.astro';

/**
 * Constrói os marcadores do mapa da rede a partir dos dados publicados.
 * Se a estação tiver coordenadas exatas usa-as; caso contrário deriva a
 * posição do centro da quadrícula Maidenhead — e assinala-o como aproximado.
 */
export async function marcadoresDaRede(
  incluir: { repetidores?: boolean; balizas?: boolean } = { repetidores: true, balizas: true },
): Promise<Marcador[]> {
  const marcadores: Marcador[] = [];

  if (incluir.repetidores !== false) {
    for (const r of await getCollection('repetidores')) {
      const d = r.data;
      const pos = d.coordenadas ?? (d.quadricula ? quadriculaParaCoordenadas(d.quadricula) : null);
      if (!pos) continue;
      marcadores.push({
        lat: pos.lat,
        lon: 'lon' in pos ? pos.lon : 0,
        titulo: d.indicativo,
        descricao: `${d.banda} · ${d.modo}<br>${d.localizacao}${d.quadricula ? ` (${d.quadricula})` : ''}<br>Tx ${d.frequenciaTx} / Rx ${d.frequenciaRx} MHz`,
        tipo: 'repetidor',
        origem: d.coordenadas ? 'exata' : 'quadricula',
        url: '/rede/repetidores/',
      });
    }
  }

  if (incluir.balizas !== false) {
    for (const b of await getCollection('balizas')) {
      const d = b.data;
      const pos = d.coordenadas ?? (d.quadricula ? quadriculaParaCoordenadas(d.quadricula) : null);
      if (!pos) continue;
      marcadores.push({
        lat: pos.lat,
        lon: 'lon' in pos ? pos.lon : 0,
        titulo: `${d.indicativo} — ${d.banda}`,
        descricao: `${d.frequencia} MHz · ${d.modo}<br>${d.localizacao}${d.quadricula ? ` (${d.quadricula})` : ''}`,
        tipo: 'baliza',
        origem: d.coordenadas ? 'exata' : 'quadricula',
        url: '/rede/balizas/',
      });
    }
  }

  return marcadores;
}
