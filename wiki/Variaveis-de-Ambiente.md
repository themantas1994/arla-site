# Variáveis de Ambiente

O projeto constrói e funciona com **zero variáveis de ambiente obrigatórias**. Existe
exatamente uma, opcional.

Esta página é o resultado de uma pesquisa exaustiva no repositório por `process.env`,
`import.meta.env`, `PUBLIC_` e ficheiros `.env*`.

---

## A tabela

| Variável | Descrição | Obrigatória | Segredo | Onde é utilizada |
| --- | --- | --- | --- | --- |
| `PUBLIC_SITE_URL` | Origem canónica do sítio. Predefinição: `https://www.cs5arla.pt` | Não | Não | `astro.config.mjs` (`site`), `src/pages/robots.txt.ts` e `scripts/check-links.mjs` (`ORIGEM_PROPRIA`) |
| `CHROMIUM_PATH` | Caminho para um binário do Chromium a usar nos guiões de navegador | Não | Não | `scripts/qa.mjs`, `scripts/lib/capturas.mjs`, `scripts/auditar-desempenho.mjs`, `scripts/auditar-csp.mjs` |

### `CHROMIUM_PATH` — quando é preciso

`CHROMIUM_PATH` é de desenvolvimento e de CI apenas: **não afeta o sítio publicado**, só
onde o Playwright vai buscar o navegador. Os quatro guiões tentam, por esta ordem:

```js
const CHROMIUM = process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium';
const navegador = await chromium.launch(
  existsSync(CHROMIUM) ? { executablePath: CHROMIUM } : {},
);
```

1. **o caminho em `CHROMIUM_PATH`**, se a variável estiver definida e o ficheiro existir;
2. **`/opt/pw-browsers/chromium`**, se existir — é onde alguns ambientes de contentor já
   trazem o Chromium instalado, e evita descarregar outro;
3. **o navegador que o Playwright instala**, se nenhum dos anteriores existir (o `{}` faz o
   Playwright resolver o caminho sozinho).

| Situação | É preciso definir? |
| --- | --- |
| Máquina normal, depois de `npx playwright install chromium` | **Não** — cai no passo 3 |
| Integração contínua (`.github/workflows/qualidade.yml`) | **Não** — instala o Chromium e cai no passo 3 |
| Contentor com o Chromium em `/opt/pw-browsers/` | **Não** — cai no passo 2 |
| Chromium já instalado noutro sítio, que se quer reutilizar | **Sim** |

```bash
CHROMIUM_PATH=/usr/bin/chromium npm run qa
```

**O caminho é específico de cada máquina.** Não o escreva em nenhum ficheiro do
repositório, nem o copie de outra máquina: `/opt/pw-browsers/chromium` é a predefinição
porque é o caminho de um ambiente concreto, não porque seja universal. Se o caminho não
existir, o guião não falha — passa ao navegador do Playwright.

Além destas, o código usa duas variáveis **internas** do Astro, que não se definem à mão:

| Expressão | O que é |
| --- | --- |
| `import.meta.env.DEV` | Verdadeiro em `astro dev`. Em `src/lib/conteudo.ts`, faz com que os rascunhos sejam visíveis em desenvolvimento e excluídos do build |
| `Astro.site` | Derivado de `site` em `astro.config.mjs`, ou seja, de `PUBLIC_SITE_URL` |

---

## `PUBLIC_SITE_URL`

```js
// astro.config.mjs
const site = process.env.PUBLIC_SITE_URL || 'https://www.cs5arla.pt';
```

Afeta:

- `<link rel="canonical">` de todas as páginas;
- `og:url` e `og:image` (que são absolutos);
- os endereços do `sitemap-index.xml`;
- as ligações do feed RSS;
- os `@id` e os endereços dentro do JSON-LD;
- em `scripts/check-links.mjs`, quais as ligações consideradas próprias e não externas.

Uso:

```bash
PUBLIC_SITE_URL=https://ensaio.exemplo.pt npm run build
```

**Não afeta o `robots.txt`**, que é um ficheiro estático com o endereço do sitemap escrito
literalmente. Ao publicar noutro domínio de forma permanente, é preciso editá-lo à mão.

O prefixo `PUBLIC_` é a convenção do Astro para variáveis que podem ser expostas ao cliente.
Aqui é usada apenas na configuração, no servidor de build — mas o nome mantém a convenção, o
que também deixa claro que **não deve guardar nada sensível**.

---

## Ficheiros `.env`

**Não existe nenhum ficheiro `.env` neste repositório.** O `.gitignore` inclui `.env`,
`.env.production` e `.env.local` por precaução.

Se um dia for preciso um, lembre-se: o Astro carrega `.env` automaticamente, e só as
variáveis com prefixo `PUBLIC_` são expostas ao código do cliente.

---

## Segredos

**Não há segredos neste repositório** — nenhuma chave de API, nenhuma credencial, nenhum
token. É uma propriedade da arquitetura, não uma coincidência:

- o sítio é estático e não fala com nenhuma API autenticada;
- o Decap CMS delega a autenticação no GitHub, por OAuth;
- o *Client ID* e o *Client Secret* dessa aplicação OAuth vivem no serviço de autenticação,
  nunca aqui — ver [CMS Decap](CMS-Decap.md).

Se alguma vez for preciso um segredo no build (por exemplo, para uma API de dados de
propagação), **não** lhe dê o prefixo `PUBLIC_`, e guarde-o nas variáveis de ambiente do
sistema de build, não num ficheiro versionado.

---

## Nos alojamentos

| Alojamento | O que definir |
| --- | --- |
| Apache / cPanel (atual) | Nada. A variável, se for precisa, define-se na máquina onde se corre `npm run build` |
| Netlify / Cloudflare Pages | Opcionalmente `PUBLIC_SITE_URL` nas definições de ambiente do site |
| Vercel | Idem |
| GitHub Actions (proposta) | Idem, se o domínio de publicação não for o de produção |
