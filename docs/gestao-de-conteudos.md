# Gestão de conteúdos

Guia para quem mantém o sítio da ARLA. **Não é preciso saber programar, nem instalar nada.**

---

## Aceder ao editor

1. Abra **https://www.cs5arla.pt/admin/**
2. Clique em **Login with GitHub** e autorize com a sua conta.
3. Está dentro. À esquerda estão as secções que pode editar.

Quem pode entrar são as pessoas com acesso ao repositório da associação no GitHub. Para
dar acesso a alguém novo, ver [implantacao.md](implantacao.md#dar-acesso-de-edição-a-alguém).

> **Antes de o editor funcionar em produção.** O acesso por **Login with GitHub** depende de
> uma aplicação OAuth e de um serviço de autenticação que ainda **não estão criados** — ver
> [implantacao.md](implantacao.md#configurar-o-editor-de-conteúdos). Até lá, o editor só
> funciona localmente, com `npx decap-server`.

> **O sítio não se publica sozinho.** Gravar no editor faz um *commit* no repositório, mas
> **não atualiza o sítio**: alguém tem de correr o build e publicar o resultado. Não existe
> publicação automática neste projeto — ver
> [implantacao.md](implantacao.md#publicação-automática--não-implementada). Depois de a
> alteração ser publicada, se não a vir, force a atualização no navegador com `Ctrl`+`F5`
> (ou `Cmd`+`Shift`+`R` no Mac).

> **Cada alteração fica registada.** O editor grava no Git: vê-se sempre quem mudou o quê e
> quando, e qualquer alteração pode ser revertida. Nada se perde por engano.

---

## Tarefas do dia a dia

### Publicar uma notícia

1. **Notícias** → **New Notícia**.
2. Preencha:
   - **Título** — claro e específico.
   - **Resumo** — uma ou duas frases. É o que aparece nos cartões, na pesquisa e quando
     alguém partilha a ligação no Facebook. Vale a pena escrevê-lo com cuidado.
   - **Data de publicação** — normalmente hoje.
   - **Categoria** — escolha uma da lista, ou escreva uma nova.
   - **Imagem principal** — opcional. Se puser uma, **preencha também a descrição da
     imagem**: é o que uma pessoa cega ouve no lugar dela.
   - **Conteúdo** — o texto. A barra de ferramentas tem negrito, listas, ligações e imagens.
3. **Publish** → **Publish now**.

Para não publicar já, ligue **Rascunho (não publicar)**: fica gravado e invisível no sítio.

### Criar um evento

**Eventos e atividades** → **New Evento**. Além dos campos habituais:

- **Data de início** (e **de fim**, se durar mais de um dia). **O sítio trata do resto**:
  classifica sozinho o evento como *programado*, *a decorrer* ou *terminado*, conforme a
  data de hoje, e move-o para o arquivo quando passar. Não é preciso fazer nada depois.
- **Datas por extenso** — use quando as datas exatas não servem. Por exemplo: *«Todos os
  domingos de julho de 2023, entre as 21:00 e as 22:00»*. Este texto substitui a data
  formatada em todo o sítio.
- **Tipo** — atividade, workshop, concurso, encontro, ou divulgação (para eventos
  organizados por terceiros que a ARLA apenas divulga).
- **Coordenadas do local** — **só preencha se souber as coordenadas reais.** Se as
  preencher, aparece um mapa na página do evento; se não, não aparece mapa nenhum. Não
  vale a pena inventar uma posição aproximada.
- **Evento cancelado** — marque em vez de apagar. O evento passa a aparecer como cancelado
  e o registo mantém-se.

> **Nunca apague um evento que já se realizou.** O arquivo de eventos é parte da história
> da associação.

### Mudar o estado de um repetidor

**Rede ARLA** → **Repetidores** → encontre o repetidor → campo **Estado**:

| Estado | Quando usar |
| --- | --- |
| **Operacional** | A funcionar normalmente |
| **Em manutenção** | Fora de serviço temporariamente, com intervenção prevista |
| **Indisponível** | Fora de serviço, sem previsão |
| **Por confirmar** | Não se sabe o estado |

Use as **Notas** para explicar (*«Fora de serviço por avaria na fonte de alimentação»*).
O estado aparece imediatamente na tabela, nos cartões do telemóvel, na página inicial e
na lista de estado da rede — tudo vem da mesma fonte.

### Acrescentar um repetidor ou baliza

**Rede ARLA** → **Repetidores** → **Add Repetidor**.

Campos que merecem atenção:

- **Identificador** — minúsculas, sem espaços nem acentos. Habitualmente o indicativo:
  `cq0varb`. Tem de ser único.
- **Filtros** — determina a que botões o repetidor responde na página. Um repetidor DMR em
  UHF leva `uhf`, `dmr` e `digital`. Se esquecer, o repetidor aparece na tabela mas
  desaparece quando alguém filtra.
- **Quadrícula Maidenhead** — com ela, o repetidor aparece no mapa, na posição aproximada
  do centro da quadrícula, e o mapa avisa que é aproximada.
- **Coordenadas exatas** — opcional. Se as preencher, substituem a posição aproximada e o
  aviso deixa de aparecer para essa estação.

### Carregar um documento (PDF)

Em dois passos:

1. **Media** (no topo) → **Upload** → escolha o ficheiro. Anote o nome com que ficou.
2. **Recursos** → **Documentos** → **Add Documento**:
   - **Identificador** — minúsculas, sem espaços: `regulamento-concurso-2026`.
   - **Caminho do ficheiro** — `/imagens/conteudo/nome-do-ficheiro.pdf`, ou
     `/documentos/nome-do-ficheiro.pdf` se alguém o tiver colocado nessa pasta.
   - **Tamanho** — escreva-o (`240 KB`). Aparece no botão de descarga, para quem está com
     dados móveis limitados saber ao que vai.

### Atualizar os órgãos sociais

Depois de uma assembleia eleitoral: **Associação** → **Órgãos Sociais**.

Altere o **Mandato** (`2026-2027`) e a **Nota sobre o mandato** (a data da deliberação),
e depois os membros de cada órgão. A página reorganiza-se sozinha.

### Alterar contactos, IBAN ou o valor da quota

**Associação** → **Dados gerais e contactos**. Estes valores são usados em **todo o sítio**
— rodapé, contactos, quotização, «ser associado», dados estruturados para os motores de
busca. Mude num sítio, muda em todos.

O correio eletrónico está guardado em duas partes (antes e depois do `@`) de propósito:
assim o sítio pode mostrá-lo como `cs5arla (arroba) gmail.com`, que os programas de
recolha de spam não reconhecem, mantendo a ligação a funcionar normalmente.

### Acrescentar uma pergunta frequente

**Recursos** → **Perguntas frequentes** → **Add Pergunta**. Além de aparecer na página,
as perguntas são publicadas em dados estruturados, o que permite ao Google mostrá-las
diretamente nos resultados de pesquisa.

---

## Assinalar conteúdo que envelheceu

Isto é importante e é fácil de esquecer.

Quando uma notícia deixa de refletir a situação atual — legislação que mudou, um repetidor
que entretanto foi desligado, um processo que já terminou — **não a apague**. Em vez disso:

1. Ligue **Conteúdo histórico**.
2. Escreva uma **Nota histórica** a explicar o contexto.

O artigo passa a mostrar um aviso no topo e uma etiqueta «Arquivo» nas listagens. A
informação continua acessível a quem a procure, mas ninguém a confunde com o que está em
vigor.

Exemplo, já aplicado aos comunicados sobre a WRC-23:

> *Comunicado de 2019 sobre o processo preparatório da WRC-23. A Conferência Mundial das
> Radiocomunicações de 2023 já se realizou; verifique junto da ANACOM e da IARU a situação
> atual da faixa dos 144-146 MHz.*

---

## Boas práticas

**Descrições de imagens.** Sempre que puser uma imagem, descreva-a. Não «foto» nem
«imagem», mas o que lá está: *«Torre de comunicações em Aldeia dos Chãos, com antenas
colineares e uma parabólica»*. Se a imagem for meramente decorativa, deixe o campo vazio.

**Resumos.** São o que o Google mostra, o que aparece no Facebook e o que a pessoa lê no
cartão antes de decidir se clica. Escreva-os como uma frase inteira, não como um título
repetido.

**Português de Portugal.** O sítio usa PT-PT de forma consistente: *ficheiro* (não
arquivo), *contacto*, *ecrã*, *utilizador*, *telemóvel*, *receção*, *eletrónico*.

**Nunca altere factos em silêncio.** Se descobrir que uma frequência publicada está errada,
corrija-a nos dados — mas se for um texto histórico que diz outra coisa, deixe o texto como
está e acrescente uma nota. O registo do que foi publicado tem valor próprio.

**Não invente.** Se não tiver a certeza de uma data, de um nome ou de uma frequência, deixe
o campo vazio ou escreva «por confirmar». Um campo vazio é honesto; um valor inventado pode
levar alguém a sintonizar a frequência errada.

---

## Perguntas frequentes de quem edita

**Gravei e não vejo a alteração.**
Espere um ou dois minutos e atualize com `Ctrl`+`F5`. Se continuar, veja em
[implantacao.md](implantacao.md#quando-o-sítio-não-atualiza).

**Enganei-me e já publiquei.**
Volte a editar e corrija — é o mais simples. Para desfazer por completo, qualquer pessoa
com acesso ao GitHub pode reverter o *commit*: o histórico guarda todas as versões.

**Posso apagar uma notícia antiga?**
Pode, mas quase nunca deve. Marque-a como **Conteúdo histórico**. O arquivo da ARLA cobre
desde 2017 e é património da associação. Apague apenas duplicados ou publicações feitas
por engano.

**Preciso de uma página nova, que não existe.**
Páginas novas envolvem código e são raras. Peça a quem mantém o sítio. As **Páginas de
texto** existentes (A ARLA, O que é o radioamadorismo, Ser radioamador, Aviso legal) podem
ser editadas livremente no CMS — só não podem ser criadas nem apagadas por aí.

---

## Editar sem o CMS

Para quem se sente à vontade com Git, o conteúdo são apenas ficheiros. Editá-los
diretamente é perfeitamente válido e dá exatamente no mesmo:

| Onde | O quê |
| --- | --- |
| `src/content/noticias/*.md` | Notícias |
| `src/content/tecnica/*.md` | Artigos técnicos |
| `src/content/eventos/*.md` | Eventos |
| `src/content/paginas/*.md` | Páginas de texto |
| `src/data/*.json` | Repetidores, balizas, órgãos sociais, documentos, contactos… |

Cada ficheiro Markdown tem um cabeçalho entre `---` com os campos, e depois o texto. Os
ficheiros JSON guardam a lista dentro de uma chave (`{ "repetidores": [...] }`) — essa
estrutura é necessária para o CMS funcionar, não a altere.

Correr `npm run build` antes de publicar diz logo se algum campo obrigatório ficou por
preencher: **o build falha em vez de publicar dados incorretos**.

---

## Arquivar conteúdo do sítio muito antigo

O sítio WordPress tinha uma ligação «Site Antigo» para `arla.org.pt`. Esse domínio já não
existe e a ligação foi removida ([porquê](arquitetura.md#decisão-5--o-sítio-antigo-em-arlaorgpt)).

Se a associação tiver uma cópia desse conteúdo e o quiser preservar:

- **Se forem poucas páginas** — o melhor caminho é migrá-las como notícias ou artigos
  técnicos marcados como **Conteúdo histórico**. Ficam pesquisáveis e integradas no sítio.
- **Se for um arquivo grande** — coloque os ficheiros em `public/arquivo-historico/` e
  acrescente uma entrada em **Recursos** → **Ligações úteis** a apontar para lá. Ficam
  acessíveis sem se misturarem com o conteúdo atual.

Se não existir cópia, não há nada a fazer: o conteúdo perdeu-se antes desta migração.
