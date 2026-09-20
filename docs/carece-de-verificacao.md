# Conteúdo que carece de verificação

Lista de tudo o que, na migração, ficou por confirmar por uma pessoa da associação.

**Nada nesta lista foi inventado.** Onde faltava informação, ficou o campo vazio, uma nota
explícita ou o texto original tal como estava. Esta é a lista do que convém rever, por
ordem de importância.

Sempre que houver dúvida sobre um facto, a regra seguida foi: **preservar o que o sítio
antigo dizia e assinalar a dúvida**, nunca corrigir em silêncio.

---

## A — Informação possivelmente desatualizada, a confirmar

Estes dados estão publicados como factos no sítio. Vieram do sítio anterior e podem já não
estar corretos.

### A1. Mandato dos órgãos sociais: 2022-2023

**Onde:** [`/arla/orgaos-sociais/`](/arla/orgaos-sociais/) · `src/data/orgaos-sociais.json`

O sítio anterior indicava a composição em vigor após a alteração de 26/03/2022, para o
mandato 2022-2023. **Esse mandato terá terminado.** A composição está publicada tal como
constava, com o mandato visível em destaque para que ninguém a leia como atual sem reparar
na data.

**A fazer:** confirmar a composição atual e atualizar em **Associação → Órgãos Sociais**.

### A2. Valor da quota: 20,00 €

**Onde:** [`/arla/quotizacao/`](/arla/quotizacao/), [`/arla/ser-associado/`](/arla/ser-associado/),
página inicial · `src/data/sitio.json`

Valor publicado no sítio anterior. **A fazer:** confirmar que se mantém.

### A3. IBAN e NIB

**Onde:** [`/arla/quotizacao/`](/arla/quotizacao/) · `src/data/sitio.json`

Reproduzidos exatamente como constavam. **A fazer:** confirmar, com atenção redobrada —
um dígito errado encaminha pagamentos de associados para outra conta.

### A4. Lista de associados: 46 nomes

**Onde:** [`/arla/quem-somos/`](/arla/quem-somos/) · `src/data/associados.json`

Copiada tal como estava publicada: número, indicativo e nome. Nenhum dado de contacto foi
acrescentado. **A fazer:** confirmar que a lista está atualizada e que todas as pessoas
continuam a consentir a publicação do seu nome e indicativo.

### A5. Estado operacional dos repetidores e balizas

**Onde:** [`/rede/repetidores/`](/rede/repetidores/), [`/rede/balizas/`](/rede/balizas/)

As treze estações estão marcadas como **operacionais**, porque era o que a tabela do sítio
anterior indicava. O sítio anterior não datava essa informação.

**A fazer:** confirmar estação a estação. Se alguma estiver fora de serviço, mudar o estado
no CMS — é imediato e aparece em todo o sítio.

### A6. Baliza de 50 MHz: «aguarda nova licença»

**Onde:** [`/rede/balizas/`](/rede/balizas/)

A tabela antiga indicava, na frequência de 50.465 MHz, «(aguarda nova licença)». A nota foi
preservada. **A fazer:** verificar se a licença entretanto saiu.

### A7. Informação de licenciamento em «Quero começar»

**Onde:** [`/radioamadorismo/comecar/`](/radioamadorismo/comecar/)

A página diz que a ANACOM gere o serviço de amador, que é preciso obter o Certificado de
Amador Nacional através de um exame de aptidão, e que existem várias categorias — tudo
apoiado no que os Estatutos e as páginas da ARLA já afirmavam.

**Deliberadamente não se indicam** taxas, datas de exame, requisitos de idade nem detalhes
das categorias: são dados que mudam e que a ARLA não publicava. A página remete para a
ANACOM e traz um aviso a dizê-lo.

**A fazer:** se a associação quiser detalhar o processo, acrescentar a informação, com a
data em que foi verificada.

---

## B — Conteúdo incompleto no sítio original

### B1. A página CS5ARLA estava vazia

**Onde:** [`/rede/cs5arla/`](/rede/cs5arla/)

A página `/site/euc-cs5arla/` do sítio anterior continha **apenas o título «EUC CS5ARLA»**.
Não havia mais nada.

A nova página reúne o que é verificável a partir de outros conteúdos: que CS5ARLA é o
indicativo oficial da associação e que é usado nas edições do Fim de Semana de AM e na
atividade 80×80. Traz uma nota a dizer que está incompleta.

**A fazer:** se existir, acrescentar informação sobre o equipamento da estação, as condições
de utilização pelos associados e as regras de QSL.

### B2. O historial termina em 2012

**Onde:** [`/arla/historia/`](/arla/historia/)

A tabela original tinha 73 entradas, de abril de 1999 a novembro de 2012, terminando com a
marca «(conteúdo em atualização)». Essa marca foi preservada e é mostrada como aviso no fim
da linha do tempo, com remissão para as notícias e eventos.

O original tinha ainda uma linha com o texto «lapso» e sem descrição. **Foi mantida tal
como estava** — é parte do documento original.

**A fazer:** completar de 2013 em diante, se houver registos.

### B3. A página de APRS não tinha conteúdo próprio

**Onde:** [`/rede/aprs/`](/rede/aprs/)

Os dois digipeaters (CQ0PLA e CQ0PST) estavam apenas como duas linhas na tabela de
repetidores. A página nova apresenta-os com os dados publicados e explica o que é um
digipeater, sem acrescentar factos sobre a rede da ARLA.

**A fazer:** se quiserem, acrescentar *paths* recomendados, iGates ou cobertura verificada.

---

## C — Datas que não foi possível determinar

Em todos estes casos, **não foi atribuída data de evento**: o conteúdo ficou como notícia,
com a data de publicação.

### 5.º Ciclo-Raid

**Página:** [`/noticias/5-ciclo-raid/`](/noticias/5-ciclo-raid/)

O texto do artigo refere «Sábado, dia 5 e Agosto de 2016», mas o artigo foi publicado em agosto de 2017. A data original foi preservada tal como publicada; confirmar o ano correto.

### Participação na Feira da Rádio da ARVM 2017

**Página:** [`/noticias/participacao-feira-radio-arvm-2017/`](/noticias/participacao-feira-radio-arvm-2017/)

O artigo refere «no próximo Domingo» sem indicar a data exata da Feira da Rádio da ARVM 2017. Não foi atribuída data de evento.

### Divulgação: Almoço convívio dos utilizadores de Voz Digital

**Página:** [`/noticias/almoco-convivio-voz-digital/`](/noticias/almoco-convivio-voz-digital/)

Divulgação de um almoço-convívio em Folgosinho organizado por terceiros; o artigo não indica a data do encontro.

### Como receber o QO-100

**Página:** [`/tecnica/qo-100-como-receber/`](/tecnica/qo-100-como-receber/)

A data de publicação original desta página não consta do sítio anterior. Foi usada uma data aproximada (2019) — corrigir no ficheiro Markdown se a data real for conhecida.

### KG-STV no QO-100

**Página:** [`/tecnica/qo-100-kg-stv/`](/tecnica/qo-100-kg-stv/)

A data de publicação original desta página não consta do sítio anterior. Foi usada uma data aproximada (2019) — corrigir no ficheiro Markdown se a data real for conhecida.

### Estação portátil para o QO-100

**Página:** [`/tecnica/qo-100-estacao-portatil/`](/tecnica/qo-100-estacao-portatil/)

Apresentação feita nos Debates Hertzianos 2021 (comemorações do Dia Mundial do Radioamador). A data exata da publicação da página não consta do sítio anterior.

---

## D — Textos legais por redigir

### D1. Política de privacidade

**Onde:** [`/legal/privacidade/`](/legal/privacidade/)

A página descreve com exatidão o que o **sítio** faz: sem cookies, sem rastreio, sem
formulários, sem contas. Tudo isto é verificável no código.

**Não descreve o tratamento de dados pessoais pela associação** — fichas de inscrição,
registo de associados, gestão de quotas, listas de distribuição, fotografias de atividades.
Essa parte tem um aviso visível a dizer que está por redigir.

**Porque não foi escrita:** redigir texto jurídico em nome da ARLA seria assumir
compromissos que a associação não tomou, sobre práticas que não são conhecidas de fora.

**A fazer:** a direção deve redigir essa secção à luz do RGPD, indicando que dados são
recolhidos, com que finalidade e fundamento, por quanto tempo, com quem são partilhados, e
como exercer os direitos dos titulares. Deve identificar o responsável pelo tratamento.

Há um ponto de partida: o [comunicado de 2018 sobre o
RGPD](/noticias/regulamento-geral-de-protecao-de-dados/), que está no arquivo.

### D2. Aviso legal

**Onde:** [`/legal/aviso-legal/`](/legal/aviso-legal/)

O texto do sítio anterior foi migrado **sem uma única alteração**. Trata apenas do envio de
mensagens de correio eletrónico e invoca a Diretiva 2002/58/CE e o Decreto-Lei n.º 7/2004.

**A fazer:** avaliar se serve como aviso legal do sítio, ou se deve ser complementado.

### D3. Condições de utilização do sítio

Não existiam no sítio anterior e não foram criadas. **A fazer:** decidir se são necessárias.

---

## E — Descrições de imagens em falta

**47 imagens** dentro de artigos migrados não têm descrição alternativa, porque o sítio
WordPress também não tinha. Uma pessoa que use leitor de ecrã não fica a saber o que essas
imagens mostram.

**Não foram inventadas descrições.** Descrever mal uma imagem é pior do que não a
descrever: um leitor de ecrã passaria a anunciar informação errada com a mesma confiança
com que anuncia a correta. As imagens ficaram com descrição vazia, o que faz com que o
leitor de ecrã as ignore em silêncio, em vez de ler o nome do ficheiro.

**A fazer:** abrir cada artigo no CMS e, para cada imagem, escrever o que ela mostra —
quem melhor o pode fazer é quem tirou a fotografia ou escreveu o artigo. Não é preciso
fazer tudo de uma vez: comece pelos artigos com mais imagens.

Uma boa descrição diz o que se vê e porque importa ali: *«Parabólica de 90 cm apontada
ao satélite, montada num tripé no terraço»* é útil; *«foto»* ou *«imagem 3»* não são.

As imagens em destaque (a que aparece no cartão) **têm** descrição em todos os 24 artigos
onde existe imagem — foi usado o título do artigo.

| Artigo | Imagens por descrever |
| --- | --- |
| [`/tecnica/weak-signals-micromeet-2021-parte-1/`](/tecnica/weak-signals-micromeet-2021-parte-1/) | 17 |
| [`/tecnica/testes-de-rececao-nos-47-ghz/`](/tecnica/testes-de-rececao-nos-47-ghz/) | 7 |
| [`/noticias/estacao-de-rececao-ais-shipxplorer/`](/noticias/estacao-de-rececao-ais-shipxplorer/) | 3 |
| [`/eventos/10a-edicao-fim-de-semana-am/`](/eventos/10a-edicao-fim-de-semana-am/) | 2 |
| [`/eventos/11a-edicao-fim-de-semana-am/`](/eventos/11a-edicao-fim-de-semana-am/) | 2 |
| [`/eventos/12a-edicao-fim-de-semana-am/`](/eventos/12a-edicao-fim-de-semana-am/) | 2 |
| [`/noticias/demolicao-da-torre-em-aldeia-dos-chaos/`](/noticias/demolicao-da-torre-em-aldeia-dos-chaos/) | 2 |
| [`/noticias/exercicio-neamwave17/`](/noticias/exercicio-neamwave17/) | 2 |
| [`/noticias/torre-aldeia-dos-chaos/`](/noticias/torre-aldeia-dos-chaos/) | 2 |
| [`/tecnica/weak-signals-micromeet-2021-parte-2/`](/tecnica/weak-signals-micromeet-2021-parte-2/) | 2 |
| [`/noticias/alguem-especial-para-refletir/`](/noticias/alguem-especial-para-refletir/) | 1 |
| [`/noticias/almoco-convivio-voz-digital/`](/noticias/almoco-convivio-voz-digital/) | 1 |
| [`/noticias/boas-festas-2017/`](/noticias/boas-festas-2017/) | 1 |
| [`/noticias/joao-costa-ct1fbf-silent-key/`](/noticias/joao-costa-ct1fbf-silent-key/) | 1 |
| [`/noticias/repetidor-dmr-cq0dla/`](/noticias/repetidor-dmr-cq0dla/) | 1 |
| [`/noticias/repetidor-vhf-aldeia-dos-chaos-em-testes/`](/noticias/repetidor-vhf-aldeia-dos-chaos-em-testes/) | 1 |

---

## F — Decisões editoriais tomadas na migração

Não são erros, mas convém que a direção saiba e possa discordar.

| Decisão | Porquê | Como reverter |
| --- | --- | --- |
| A ligação «Site Antigo» para `arla.org.pt` foi removida | O domínio já não resolve em DNS — a ligação estava partida para todos | Ver [gestão de conteúdos](gestao-de-conteudos.md#arquivar-conteúdo-do-sítio-muito-antigo) |
| 176 imagens que apontavam para `arla.org.pt` foram descarregadas e reapontadas | Estavam partidas no sítio em produção; os ficheiros existiam em `cs5arla.pt` | — |
| Conteúdo repartido por notícias, eventos e artigos técnicos | No WordPress, 58 de 61 artigos estavam na categoria «geral» | Qualquer item pode ser reclassificado |
| Comunicados sobre a WRC-23 e legislação marcados como histórico | São de 2019-2022 e referem processos entretanto concluídos | Desligar «Conteúdo histórico» no CMS |
| Posições no mapa derivadas da quadrícula Maidenhead | A ARLA publica quadrículas, não coordenadas. O mapa diz que são aproximadas | Preencher «Coordenadas exatas» no CMS |
| Não há polígonos de cobertura | Não existem estudos de cobertura publicados; desenhá-los seria inventar dados técnicos | Requer estudo real |
| Páginas de conta do WordPress substituídas por uma página explicativa | Não tinham conteúdo e o sítio novo é estático | Ver [arquitetura](arquitetura.md#evolução-futura) |
| Datas de eventos só quando constam do texto do artigo | Inventar datas seria falsificar o arquivo | Preencher no CMS, caso a caso |
