# Media e Imagens

---

## Onde está a media

| Diretório | O que contém |
| --- | --- |
| `public/imagens/conteudo/` | Imagens e dois vídeos migrados do sítio WordPress; destino dos carregamentos do CMS |
| `public/imagens/` | `logotipo-arla.png`, `logotipo-arla-640.png`, `icone-arla.jpg`, `icone-512.png` |
| `public/documentos/` | PDF da associação: `estatutos-arla.pdf`, `regulamentos-internos.pdf`, `arla-ficha-de-inscricao.pdf` |
| `public/` (raiz) | `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png` |

Tudo o que está em `public/` é copiado tal e qual para `dist/`, sem processamento.

**Formatos em uso:** `.jpg`/`.jpeg` e `.png` para imagens, `.mp4` para os dois vídeos
(`hamradio.mp4`, `14.mp4`), `.pdf` para documentos, `.svg` para o favicon.

---

## Como referenciar

Por **caminho absoluto a partir de `public/`**:

```markdown
![Antena na torre](/imagens/conteudo/20180818_Torre_ARLA-1.jpg)
```

```yaml
imagem: "/imagens/conteudo/ct1fbf.jpg"
imagemAlt: "João Costa, CT1FBF, à estação"
```

O CMS grava exatamente neste formato: `media_folder: public/imagens/conteudo` define onde o
ficheiro fica, `public_folder: /imagens/conteudo` define como é referenciado.

---

## Otimização — IMPLEMENTADO, mas fora do build

Esta é a parte onde é fácil enganar-se, por isso vale a pena ser explícito:

| | Estado |
| --- | --- |
| `scripts/otimizar-media.mjs` (Sharp) | **IMPLEMENTADO** — mas executado à mão, nunca pelo build |
| Otimização automática durante `npm run build` | **NÃO IMPLEMENTADO** |
| APIs `<Image>` / `getImage()` do Astro | **NÃO UTILIZADAS** em nenhuma página |
| Definições `image` em `astro.config.mjs` | Presentes (`layout: 'constrained'`, `responsiveStyles: true`), mas **sem efeito**, porque só se aplicam a essas APIs |

As páginas e o Markdown referenciam as imagens com `<img src="/imagens/conteudo/…">`, ou
seja, ficheiros estáticos servidos tal como estão. **Não há geração de `srcset`, nem
conversão para AVIF ou WebP, nem redimensionamento no build.** A dimensão com que um
ficheiro está no repositório é a dimensão que é descarregada.

### `scripts/otimizar-media.mjs`

```bash
node scripts/otimizar-media.mjs                    # public/imagens/conteudo
node scripts/otimizar-media.mjs public/imagens     # outro diretório
```

O que faz, verificado no código:

- percorre **apenas o primeiro nível** do diretório indicado (`readdir` sem recursão) e trata
  só `.jpg`, `.jpeg` e `.png`;
- aplica `rotate()` (para respeitar a orientação EXIF) e redimensiona para **1600 px de
  largura máxima** (`withoutEnlargement`, ou seja, nunca aumenta);
- recodifica: **mozjpeg** progressivo a qualidade 82 para JPEG, **PNG paletizado** com
  `compressionLevel: 9` para PNG;
- **é idempotente**: salta ficheiros que já têm menos de 1600 px de largura *e* menos de
  220 kB, e só substitui o original quando o resultado fica mais leve;
- **reescreve os ficheiros no lugar** — corra-o com a árvore de trabalho limpa, para poder
  ver a diferença no `git diff` e reverter se algo correr mal.

Resultado registado na migração: 99 imagens do WordPress, de 68 MB para 18 MB; o vídeo da
torre, recodificado à parte (H.264 CRF 28, 1280 px, `+faststart`), de 40 MB para 4 MB. Ver
[`docs/qualidade.md`](../docs/qualidade.md#otimização-dos-recursos-migrados).

**O vídeo não é tratado por este guião** — a recodificação foi feita à mão com `ffmpeg`, que
não é dependência do projeto.

### Ao carregar media nova

O Decap CMS **não otimiza nada**: grava o ficheiro tal como foi enviado. Uma fotografia de
telemóvel de 6 MB fica com 6 MB no repositório e é servida com 6 MB. Duas formas de evitar:

1. Redimensionar antes de carregar (o mais simples para quem edita).
2. Passar `node scripts/otimizar-media.mjs` periodicamente sobre
   `public/imagens/conteudo/` e fazer commit do resultado.

Esta é uma limitação real do processo atual, não um detalhe: o peso das páginas está bom
hoje porque a media migrada foi otimizada uma vez.

---

## Nomes de ficheiro

Os ficheiros migrados mantêm o nome original (`20180818_Torre_ARLA-1.jpg`,
`micromeet_2021_14.jpg`, `qo100_1_5.png`), para que seja possível confrontá-los com o sítio
anterior. Os carregamentos pelo CMS mantêm o nome do ficheiro enviado.

Para ficheiros novos, convém: minúsculas, sem acentos nem espaços, com hífenes, e um nome
que diga o que a imagem é (`torre-aldeia-dos-chaos-2026.jpg`).

**Nunca use nomes que só difiram em maiúsculas.** `public/imagens/conteudo/` tinha
`hamRadio.mp4` e `hamradio.mp4`, byte a byte iguais (mesmo `md5`) — ambíguo em sistemas de
ficheiros que ignoram maiúsculas, onde um se sobrepõe ao outro consoante a ordem do
checkout. Só o minúsculo era referenciado, em
`src/content/paginas/ser-radioamador.md`.

Na remediação da auditoria (DT-010) ficou só `hamradio.mp4`, e o nome antigo passou a ter
uma redireção 301 em `src/lib/redirects.mjs`, em `redirecoesDeFicheiros` — por precaução,
caso alguém tenha ligado ao endereço maiúsculo:

```text
/imagens/conteudo/hamRadio.mp4  →  /imagens/conteudo/hamradio.mp4
```

Só resta um vídeo com nome herdado (`14.mp4`), que não colide com nada.

---

## Texto alternativo — IMPLEMENTADO

- **Em frontmatter:** `imagemAlt`. O CMS indica que é obrigatório sempre que houver imagem
  (o campo está `required: false` no `config.yml`, com o aviso no `hint`, para não bloquear
  imagens decorativas).
- **No corpo Markdown:** a sintaxe normal, `![descrição](/caminho.jpg)`.
- **Imagens decorativas** devem ficar com texto alternativo vazio (`alt=""`), para que os
  leitores de ecrã as ignorem.

`npm run audit:seo` conta as imagens com `alt` vazio — na última execução, 126 ocorrências.
**Não é automaticamente um problema:** inclui ícones e imagens decorativas, para os quais o
`alt` vazio é a resposta certa. É um número para rever periodicamente, não um erro.

---

## Documentos (PDF)

Ficam em `public/documentos/` e são descritos em `src/data/documentos.json`:

```json
{
  "id": "estatutos",
  "nome": "Estatutos da ARLA",
  "descricao": "…",
  "categoria": "Estatutos",
  "ficheiro": "/documentos/estatutos-arla.pdf",
  "tipo": "PDF",
  "tamanho": "109 KB"
}
```

**`tamanho` é escrito à mão e não é verificado** — mostrado no botão de descarga, para quem
está com dados móveis limitados saber ao que vai. Ao substituir um PDF, atualize também o
tamanho.

Pelo CMS, são dois passos: carregar o ficheiro em **Media** e depois criar a entrada em
**Recursos → Documentos** com o caminho. Um ficheiro carregado pelo CMS vai para
`/imagens/conteudo/`, não para `/documentos/` — o campo `ficheiro` tem de refletir isso.

Os três PDF existentes têm redireções 301 dos endereços antigos, definidas **apenas** em
`public/.htaccess` e `public/_redirects`. Ver [Redirecionamentos](Redirecionamentos.md).

---

## Recursos externos

| O quê | Onde | Como é carregado |
| --- | --- | --- |
| Telas do OpenStreetMap | Páginas com mapa | Só quando o mapa entra no ecrã |
| Painéis do HamQSL e do NOAA/SWPC | `/radioamadorismo/meteorologia-espacial/` | `loading="lazy"`, com `referrerpolicy="no-referrer"` e texto alternativo |

São imagens servidas por terceiros, com a fonte identificada. Se deixarem de responder, a
página continua utilizável.
