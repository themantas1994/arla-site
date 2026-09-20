# Desempenho

O desempenho deste sítio não vem de otimizações pontuais, mas de decisões de arquitetura:
HTML estático, zero JavaScript por predefinição, nenhum tipo de letra descarregado e nenhum
recurso de terceiros no caminho crítico.

---

## O que está implementado

| Medida | Como | Estado |
| --- | --- | --- |
| Zero JS na maioria das páginas | O Astro não hidrata nada; não há diretivas `client:*` | IMPLEMENTADO |
| CSS numa só folha | `global.css`, com `inlineStylesheets: 'auto'` a embutir o que é pequeno | IMPLEMENTADO |
| Sem tipos de letra descarregados | Pilha do sistema em `--fonte-base` | IMPLEMENTADO |
| Mapas diferidos | `IntersectionObserver` + `import()` dinâmico do Leaflet | IMPLEMENTADO |
| Índice de pesquisa diferido | Pagefind só é descarregado em `/pesquisa/`, e em pedaços | IMPLEMENTADO |
| Imagens abaixo da dobra | `loading="lazy"`, `decoding="async"` e dimensões explícitas | IMPLEMENTADO |
| Prefetch de ligações internas | `prefetch: { prefetchAll: true, defaultStrategy: 'hover' }` | IMPLEMENTADO |
| Cache longa de recursos estáticos | `Cache-Control: public, max-age=31536000, immutable` no `.htaccess`, para js/css/woff2/avif/webp/png/jpe?g/svg/mp4 | IMPLEMENTADO |
| Imagens migradas otimizadas | `scripts/otimizar-media.mjs`, corrido à mão uma vez: 68 MB → 18 MB | IMPLEMENTADO (fora do build) |
| Vídeo recodificado | H.264 CRF 28, 1280 px, `+faststart`: 40 MB → 4 MB | Feito à mão, com `ffmpeg` |
| Otimização de imagens **durante** o build | — | **NÃO IMPLEMENTADO** — ver [Media e Imagens](Media-e-Imagens.md) |

---

## Medições

`npm run audit:desempenho` mede 8 páginas a 390 px de largura, com **4G lento**
(1,6 Mbit/s de descarga, 150 ms de latência), **CPU 4× mais lento** e cache fria. LCP e CLS
são recolhidos por `PerformanceObserver`, como as ferramentas de campo.

Última execução (setembro de 2026):

| Página | Peso | Pedidos | LCP | FCP | CLS | Nós |
| --- | --- | --- | --- | --- | --- | --- |
| Início | 253 kB | 8 | 656 ms | 656 ms | 0 | 1555 |
| Repetidores | 168 kB | 6 | 572 ms | 572 ms | 0 | 1315 |
| Notícias | 273 kB | 6 | 472 ms | 472 ms | 0 | 732 |
| Artigo técnico longo | 153 kB | 4 | 588 ms | 588 ms | 0 | 907 |
| Eventos | 106 kB | 4 | 504 ms | 504 ms | 0 | 890 |
| Contactos (com mapa) | 108 kB | 6 | 540 ms | 540 ms | 0 | 639 |
| Ser associado/a | 87 kB | 4 | 512 ms | 512 ms | 0 | 621 |
| Quero começar | 93 kB | 4 | 496 ms | 496 ms | 0 | 685 |

Limiares de referência: LCP ≤ 2500 ms, CLS ≤ 0,1. **Todas as páginas ficam abaixo de um
terço do limiar de LCP, e o CLS é zero em todas.**

### Repartição do peso da página inicial

| Recurso | Peso |
| --- | --- |
| Documento HTML | 141 kB |
| CSS | 48 kB |
| JavaScript | 5 kB |
| Imagens | 58 kB |
| Tipos de letra | 0 kB |
| Pedidos a terceiros | 0 |

O documento é pesado em relação ao resto porque `inlineStylesheets: 'auto'` embute parte do
CSS — é uma troca deliberada: menos um pedido bloqueante no primeiro carregamento.

Os mapas e o índice de pesquisa não entram nestes números, porque só são descarregados por
quem os usa.

### Comparação com o sítio anterior

Página inicial, mesma medida:

| | WordPress anterior | Sítio atual | Diferença |
| --- | --- | --- | --- |
| Peso total | 1364 kB | 252 kB | −82 % |
| Pedidos | 47 | 8 | −83 % |
| JavaScript | 440 kB | 5 kB | −99 % |
| Pedidos a terceiros | vários | 0 | — |

---

## Onde está o custo, hoje

Por ordem de relevância, se alguma vez for preciso reduzir mais:

1. **O peso das páginas de listagem** (Notícias, 273 kB) vem sobretudo das imagens dos
   cartões. Sem otimização no build, o ficheiro tal como está no repositório é o que é
   servido.
2. **O número de nós do DOM na página inicial** (1555) é o mais alto do sítio: a tabela de
   repetidores aparece duas vezes no HTML (tabela e cartões). É o preço da alternância
   puramente em CSS, e vale a pena — mas é bom saber de onde vem.
3. **O CSS embutido** no documento. Reduzi-lo passaria por dividir `global.css`, o que
   complicaria o sistema de design por um ganho pequeno.

---

## Ao fazer alterações

- Não acrescente dependências de cliente sem uma razão que pese mais do que os kB. Hoje são
  5 kB de JavaScript na página inicial.
- Não carregue tipos de letra externos: quebraria uma das razões pelas quais o FCP é tão
  baixo.
- Recursos de terceiros, se forem mesmo necessários, devem ser diferidos e ter uma
  alternativa (é o que acontece com os mapas e com os painéis de meteorologia espacial).
- Ao acrescentar imagens, **redimensione-as antes** ou corra
  `node scripts/otimizar-media.mjs`.
- Dê sempre `width` e `height` às imagens: o CLS está a zero e convém que continue.
- Depois de alterar: `npm run build && npm run preview & && npm run audit:desempenho`.
