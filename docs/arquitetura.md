# Arquitetura

Como o sítio está construído, e porquê. Cada decisão significativa está registada
com a alternativa que foi posta de lado.

---

## O ponto de partida

O sítio anterior era um WordPress com o tema *Septera*, publicado em
`https://www.cs5arla.pt/site/`. A auditoria (ver
[`inventario-de-conteudos.md`](inventario-de-conteudos.md)) encontrou:

- 61 artigos e 27 páginas, com boa informação técnica e histórica;
- navegação com quatro níveis de profundidade e nomes pouco claros;
- dados valiosos — repetidores, balizas, órgãos sociais — presos em tabelas de HTML;
- **176 referências a `arla.org.pt`, um domínio que já não resolve** — ou seja, imagens
  partidas em vários artigos do sítio em produção;
- páginas de conta e registo do WordPress que não chegavam a servir de nada;
- ~1,2 MB de CSS e JavaScript de tema e plugins na página inicial.

---

## Decisão 1 — Astro, gerando um sítio estático

**Escolhido:** [Astro](https://astro.build) 5, em modo estático.

**Porquê:**

- O conteúdo muda algumas vezes por mês. Não há nada dinâmico por utilizador: nenhuma
  página precisa de ser calculada a cada pedido. Um sítio estático é o que melhor
  corresponde ao problema.
- Astro envia **zero JavaScript por predefinição**. Cada componente interativo — filtros
  de repetidores, pesquisa, mapa — carrega apenas o seu próprio código, e só onde é usado.
  Isto importa a alguém que consulta as frequências de um repetidor no telemóvel, no campo,
  com rede fraca.
- As *content collections* dão validação com Zod: se alguém gravar um repetidor sem
  frequência ou com um estado inválido, **o build falha** em vez de publicar dados
  incorretos. Para dados técnicos que as pessoas usam para sintonizar rádios, isto não
  é um detalhe.
- Um sítio estático não tem base de dados, não tem painel de administração exposto e não
  tem plugins por atualizar. A superfície de ataque de um WordPress desaparece.
- Alojar é barato e simples: qualquer servidor de ficheiros serve, incluindo o atual.

**Alternativas ponderadas:**

| Alternativa | Porque não |
| --- | --- |
| Manter o WordPress, mudar o tema | Era exatamente o que o pedido excluía. Não resolveria a arquitetura de informação nem a manutenção. |
| Next.js | O React que traz só se justificaria se houvesse muita interatividade. Aqui pagaria-se o custo sem usar o benefício. |
| Hugo / Eleventy | Excelentes e rápidos, mas sem tipagem forte do conteúdo. A validação com Zod foi o fator decisivo. |
| Headless CMS alojado (Contentful, Sanity) | Custo recorrente e dependência externa para uma associação sem fins lucrativos. O conteúdo em Git é gratuito, versionado e nunca fica refém de um fornecedor. |

---

## Decisão 2 — Conteúdo em Git, editado com Decap CMS

Nada de importante está escrito no código. Toda a informação vive em:

- **Markdown** (`src/content/`) para o que é texto: notícias, artigos, eventos, páginas;
- **JSON** (`src/data/`) para o que é estrutura: repetidores, balizas, órgãos sociais,
  documentos, ligações, FAQ, contactos.

O [Decap CMS](https://decapcms.org) em `/admin/` dá a quem edita um formulário em
português para cada um destes tipos, e grava diretamente no repositório. Cada alteração
é um *commit*: vê-se quem mudou o quê, quando, e reverte-se em segundos.

**Porquê este e não outro:** é gratuito, não precisa de servidor próprio, autentica-se
pelo GitHub e o conteúdo continua a ser ficheiros de texto legíveis — mesmo que o CMS
desapareça amanhã, o conteúdo fica intacto e editável.

**Consequência a conhecer:** o Decap não consegue editar um ficheiro JSON cuja raiz seja
um *array*. Por isso todos os ficheiros de dados guardam a lista dentro de uma chave
(`{ "repetidores": [...] }`) e o carregador do Astro desembrulha-a com um *parser*
definido em `src/content.config.ts`.

---

## Decisão 3 — Arquitetura de informação

A navegação passou de quatro níveis para dois, organizada por **intenção do visitante**
em vez de por estrutura interna da associação:

| Secção | Para quem | O que responde |
| --- | --- | --- |
| **ARLA** | Quem quer conhecer ou associar-se | Quem somos, história, órgãos, como aderir, quotas |
| **Radioamadorismo** | Novatos *e* experientes | O que é isto, como começar, artigos técnicos |
| **Rede ARLA** | Radioamadores | Repetidores, balizas, APRS, CS5ARLA, mapa |
| **Notícias** | Todos | Atualidade, eventos, arquivo |
| **Recursos** | Todos | Documentos, ligações, FAQ |
| **Contactos** | Todos | Morada, correio, mapa, dados de estação |

Duas mudanças de fundo:

1. **A rede passou a ser uma secção de primeiro nível.** No sítio antigo, os repetidores
   estavam dentro de «EUC CS5ARLA», dentro de um menu. É a informação mais procurada por
   um radioamador — agora está a um clique, e o herói da página inicial tem um atalho direto.
2. **«Quero começar» é uma página nova.** O sítio antigo tinha textos excelentes sobre o
   que é o radioamadorismo, mas nada dirigido a quem acaba de descobrir o tema. O conteúdo
   original foi preservado tal como estava e criou-se, ao lado, um percurso para principiantes.

---

## Decisão 4 — Eventos separados de notícias

No WordPress, tudo era «post» e 58 dos 61 estavam na categoria «geral». Uma sessão de
SSTV marcada para um sábado e um comunicado sobre legislação eram a mesma coisa.

Agora há três tipos, com campos próprios:

- **Notícias** — o que aconteceu ou foi comunicado;
- **Eventos** — o que tem data e lugar, classificado automaticamente como *programado*,
  *a decorrer* ou *terminado* pela comparação da data com o dia atual;
- **Artigos técnicos** — conteúdo de referência, com índice, nível de dificuldade,
  autor com indicativo e tempo de leitura.

**Nenhuma data de evento foi inventada.** Só existe data quando ela consta explicitamente
do texto do próprio artigo. Nos casos em que o artigo diz apenas «no próximo domingo», o
conteúdo ficou como notícia e o caso está registado em
[`carece-de-verificacao.md`](carece-de-verificacao.md).

---

## Decisão 5 — O sítio antigo em `arla.org.pt`

O rodapé do WordPress tinha uma ligação «Site Antigo» para `http://arla.org.pt/index1.html`.

**Verificação:** o domínio `arla.org.pt` **já não resolve em DNS**. A ligação estava
partida para todos os visitantes, e 176 imagens espalhadas pelos artigos apontavam para
lá — imagens que hoje não carregam no sítio em produção.

**Decisão:** a ligação foi removida, porque manter uma ligação para um domínio inexistente
não serve ninguém. Os ficheiros que estavam a ser referenciados nesse domínio existem, com
o mesmo caminho, em `cs5arla.pt` — a migração reescreveu todos esses endereços e
descarregou as imagens para o repositório. **O efeito prático é que artigos que hoje têm
imagens partidas passam a mostrá-las.**

Se a associação tiver um arquivo do conteúdo do domínio antigo que queira preservar,
há duas formas de o fazer, descritas em
[`gestao-de-conteudos.md`](gestao-de-conteudos.md#arquivar-conteúdo-do-sítio-muito-antigo).

---

## Decisão 6 — Posições no mapa a partir da quadrícula

A ARLA publica a quadrícula Maidenhead de cada repetidor e baliza (`IM57px`, `IM58ml`),
mas não as coordenadas exatas.

**Decisão:** os marcadores são calculados a partir do **centro da sub-quadrícula**
(`src/lib/maidenhead.ts`), e **o mapa diz que a posição é aproximada** — na nota sob o
mapa e na janela de cada marcador. Só a sede aparece com coordenadas exatas, porque são
essas que a ARLA publica.

**Não são desenhados polígonos de cobertura.** A associação não publica estudos de
cobertura verificados; desenhá-los seria inventar informação técnica que alguém poderia
usar para decidir se consegue aceder a um repetidor.

Se a direção vier a ter coordenadas rigorosas, basta preenchê-las no CMS: o campo
`coordenadas` existe em cada repetidor e baliza e, quando preenchido, substitui a
posição aproximada e a nota deixa de aparecer para essa estação.

---

## Decisão 7 — Pesquisa com Pagefind

[Pagefind](https://pagefind.app) constrói o índice a partir do HTML final, no fim do build.

- Não é preciso servidor de pesquisa nem serviço externo.
- O índice é descarregado em pedaços, só quando alguém pesquisa: a página de pesquisa
  não pesa nas outras.
- Lida bem com português, incluindo acentos — «satelite» encontra «satélite».
- O cabeçalho e o rodapé estão marcados com `data-pagefind-ignore` para não poluírem
  os resultados; só o conteúdo de `<main>` é indexado.

---

## Decisão 8 — Nada de terceiros no caminho crítico

Não há Google Analytics, nem Google Fonts, nem *widgets* de redes sociais, nem qualquer
outro recurso de terceiros carregado por predefinição. A tipografia usa a pilha de
tipos de letra do sistema — que carrega instantaneamente e respeita as definições do
utilizador.

Três exceções, todas justificadas e todas diferidas:

| O quê | Onde | Como é carregado |
| --- | --- | --- |
| Telas do OpenStreetMap | Mapas | Só quando o mapa entra no ecrã |
| Painéis do HamQSL e NOAA | Meteorologia espacial | `loading="lazy"`, com `referrerpolicy="no-referrer"` |
| Decap CMS | `/admin/` | Página de administração, fora do sítio público e bloqueada no `robots.txt` |

O Leaflet **não** vem de um CDN: é uma dependência do projeto, empacotada com o sítio e
carregada em `import()` dinâmico quando um mapa fica visível.

---

## Tema claro e escuro

O tema escuro é a predefinição — condiz com o logótipo da ARLA, que é branco sobre fundo
transparente, e é o que a maioria dos utilizadores técnicos prefere. **O tema claro é
igualmente completo**, com os seus próprios valores de contraste, não uma inversão.

- `prefers-color-scheme` é respeitado enquanto o utilizador não escolher;
- a escolha é guardada em `localStorage` e aplicada por um pequeno *script* em linha
  **antes da primeira pintura**, para não haver salto de cor;
- todos os acessos ao `localStorage` estão dentro de `try`/`catch`: em janela privada ou
  com dados bloqueados, o sítio funciona na mesma, usando a preferência do sistema.

`prefers-reduced-motion` desliga a varredura do espectro no herói, a pulsação dos
indicadores e todas as transições.

---

## Desempenho

| Medida | Como |
| --- | --- |
| Zero JS na maioria das páginas | Astro não hidrata nada por predefinição |
| Imagens migradas otimizadas | `scripts/otimizar-media.mjs`: 1600px máx., mozjpeg/PNG paletizado — 68 MB → 18 MB |
| Vídeo recodificado | H.264 CRF 28, 1280px, `+faststart` — 40 MB → 4 MB |
| Sem tipos de letra descarregados | Pilha de tipos do sistema |
| CSS numa só folha | ~20 KB comprimidos, com `@layer` para cascata previsível |
| Mapas e pesquisa diferidos | `IntersectionObserver` e `import()` dinâmico |
| Imagens abaixo da dobra | `loading="lazy"` e `decoding="async"`; dimensões explícitas evitam saltos de layout |

---

## Acessibilidade

O objetivo é WCAG 2.2 AA. As medidas estruturais:

- HTML semântico: `header`, `nav`, `main`, `article`, `section`, `aside`, `footer`,
  com hierarquia de títulos verificada página a página;
- **nada depende de passar o rato**: os submenus abrem com clique e com teclado, e fecham
  com `Escape`; o hover é um extra para quem usa rato;
- foco sempre visível, com `:focus-visible` de 3px;
- ligação «saltar para o conteúdo» como primeiro elemento focável;
- tabelas com `<caption>`, `<thead>` e `scope` nas colunas, e uma representação em
  cartões em ecrãs estreitos — não uma tabela espremida;
- **a cor nunca é o único sinal**: os estados operacionais têm símbolo (`●` `◐` `✕` `?`)
  e texto, e continuam legíveis em impressão a preto e branco;
- alvos de toque com pelo menos 44 × 44 px nos controlos principais;
- região `aria-live` que anuncia a leitores de ecrã quando se copia uma frequência;
- todos os mapas têm **alternativa textual** com as mesmas localizações.

Resultados medidos: [`qualidade.md`](qualidade.md).

---

## SEO

- URLs semânticos em português, sem datas no caminho;
- `<title>`, descrição, canónico, Open Graph e Twitter Card em todas as páginas;
- dados estruturados JSON-LD: `Organization` em todo o sítio, mais `NewsArticle`,
  `TechArticle`, `Event`, `FAQPage`, `HowTo`, `BreadcrumbList` e `WebSite` conforme a página;
- `sitemap-index.xml` gerado no build, com a área reservada excluída;
- `robots.txt` que bloqueia `/admin/` e `/area-reservada/`;
- **189 redireções 301** do sítio antigo, em três formatos (ver
  [`mapa-de-redirecoes.md`](mapa-de-redirecoes.md));
- feed RSS em `/rss.xml` com notícias, artigos e eventos.

---

## Evolução futura

A arquitetura deixa caminho aberto, sem nada implementado por antecipação:

- **Outro idioma.** Todo o texto da interface está nos componentes e o conteúdo em
  coleções. Acrescentar inglês é criar `src/content/noticias/en/` e ativar o
  encaminhamento i18n do Astro; não obriga a reescrever o sítio.
- **Estado dos repetidores em tempo real.** O campo `estado` já existe e está tipado. Se
  algum dia houver uma fonte automática, troca-se a origem do dado sem mexer na interface.
- **Área reservada com autenticação.** Exigiria uma parte dinâmica: o Astro suporta modo
  híbrido, bastando acrescentar um adaptador e tornar essas rotas servidas. O resto do
  sítio continuaria estático.
- **Dados de propagação ou passagens de satélite.** Só faz sentido com uma fonte fiável e
  estável. Enquanto não houver, a página de meteorologia espacial mostra os painéis que a
  ARLA já usava, com a fonte identificada.
