# Segurança

Esta página separa o que está **verificado** do que é **recomendação**. As limitações estão
escritas por inteiro: um sítio de uma associação não ganha nada com uma página de segurança
otimista.

---

## Proteções verificadas

### Sem segredos no repositório

Pesquisa exaustiva por `process.env`, `import.meta.env`, `PUBLIC_` e ficheiros `.env*`:
**não há chaves de API, credenciais nem tokens**. A única variável do projeto é
`PUBLIC_SITE_URL`, que é um endereço público. Ver
[Variáveis de Ambiente](Variaveis-de-Ambiente.md).

### Sem superfície de servidor

Em produção não corre código do sítio: não há base de dados, não há PHP, não há runtime.
A superfície de ataque típica de um WordPress — plugins por atualizar, `wp-admin` exposto,
injeção de SQL — desaparece com a arquitetura estática.

### Autenticação delegada

O Decap CMS autentica por **OAuth do GitHub**. O sítio nunca vê nem guarda palavras-passe.
Quem edita é quem tem acesso de escrita ao repositório; dar e retirar acesso é gerir
colaboradores no GitHub.

### Cabeçalhos de segurança

Em `public/.htaccess`, dentro de `<IfModule mod_headers.c>`:

| Cabeçalho | Valor |
| --- | --- |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `X-Frame-Options` | `SAMEORIGIN` |
| `Permissions-Policy` | `geolocation=(), microphone=(), camera=()` |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` |

**Só se aplicam no Apache.** Qualquer outro alojamento tem de os replicar ao nível do
servidor ou da CDN — não são enviados pelo Astro.

### Sem HTML de utilizador por sanear

Todo o conteúdo é Markdown escrito por quem tem acesso de escrita ao repositório, e é
processado no build pelo pipeline do Astro. Não há formulários que aceitem submissões, não
há comentários, não há campos guardados. Os campos de pesquisa e de filtro operam
exclusivamente no navegador de quem visita.

### Ligações externas

Com `rel="noopener noreferrer"`. Os painéis externos da página de meteorologia espacial
usam também `referrerpolicy="no-referrer"`.

### `robots.txt`

Bloqueia `/admin/` e `/area-reservada/`. **Não é uma fronteira de segurança** — apenas
mantém estas páginas fora dos motores de busca. A proteção do `/admin/` é o GitHub exigir
autenticação para escrever no repositório.

### Validação de conteúdo

Os esquemas Zod fazem falhar o build quando um campo obrigatório falta ou um valor de enum
é inválido. Não é uma medida de segurança contra atacantes, mas protege contra a falha mais
provável e mais danosa deste sítio: publicar dados técnicos errados.

---

## Limitações conhecidas

### Content-Security-Policy em `Report-Only` — NÃO IMPOSTA

Existe uma CSP, servida no `.htaccess` como `Content-Security-Policy-Report-Only`. **Não
bloqueia nada**: o navegador limita-se a registar na consola o que bloquearia.

A política vive em `scripts/lib/csp.mjs` (fonte única) e é testada por
`npm run audit:csp`, que a aplica em modo **impositivo** num navegador real, em 15 páginas
— incluindo os mapas, a meteorologia espacial, a pesquisa e o `/admin/` — e conta as
violações. Última execução: 0.

A limitação que impede impô-la já é `'unsafe-inline'` em `script-src`. O Astro produz
`<script type="module">` em linha em várias páginas, e o guião do tema em `Base.astro`
**tem** de correr antes da primeira pintura. Com `'unsafe-inline'`, **a CSP não protege
contra XSS injetado em linha** — continua a fechar origens externas, `eval`, `<base>`,
formulários para fora e o embebimento do sítio, mas convém ser exato sobre o que faz.

O caminho para a impor, e porque não se impõe às cegas, está em
[`docs/seguranca-csp.md`](../docs/seguranca-csp.md).

**Atenção:** o `.htaccess` só é lido por Apache. Noutro alojamento, nenhum destes
cabeçalhos é aplicado — CSP incluída.

### Decap CMS carregado de um CDN — com versão fixa e SRI

`public/admin/index.html` carrega o Decap de `unpkg.com`, agora com **versão exata** e
**Subresource Integrity**:

```html
<script
  src="https://unpkg.com/decap-cms@3.16.2/dist/decap-cms.js"
  integrity="sha384-…"
  crossorigin="anonymous"
></script>
```

Antes era `decap-cms@^3.8.4` sem `integrity`: o CDN escolhia a versão — na prática servia
já a 3.16.2 — e um ficheiro trocado passaria sem ninguém dar por isso, com acesso de
escrita ao repositório da associação. Verificado em teste: com um `integrity` errado, o
navegador recusa o ficheiro e a página fica com a mensagem de diagnóstico visível em vez de
arrancar em silêncio.

**Ao atualizar o Decap, mude as duas coisas ao mesmo tempo:**

```bash
curl -sL https://unpkg.com/decap-cms@<versão>/dist/decap-cms.js \
  | openssl dgst -sha384 -binary | openssl base64 -A
```

Continua a ser uma dependência de um CDN de terceiros. Servir o ficheiro do próprio domínio
eliminaria isso, ao custo de ~5 MB de JavaScript versionado no repositório.

### Vulnerabilidades em dependências

`npm audit` reporta **2 vulnerabilidades: 1 crítica e 1 baixa**. Eram 3 à data da
auditoria; a alta (`sharp`) foi corrigida na remediação:

| Pacote | Gravidade | Natureza | Aplicabilidade a este sítio |
| --- | --- | --- | --- |
| `astro` | Crítica | Conjunto de avisos de XSS (`define:vars`, atributos em spread, diretivas `transition:*`, nomes de slot), SSRF em página de erro pré-renderizada, RCE por otimização de imagens AVIF, e outros | **Maioritariamente não aplicável**: são vulnerabilidades de renderização por pedido, de server islands, de View Transitions e de otimização de imagens — nada disso é usado aqui. O build é estático e o HTML é gerado a partir de conteúdo do próprio repositório |
| ~~`sharp`~~ | ~~Alta~~ | ~~Vulnerabilidades herdadas de `libvips` e `libheif`~~ | **CORRIGIDA** — `sharp@^0.35.4`, com um `override` para o Astro não manter uma cópia da versão vulnerável. Verificado: `scripts/otimizar-media.mjs` continua a funcionar e o build passa |
| `esbuild` | Baixa | Leitura arbitrária de ficheiros com o servidor de desenvolvimento no Windows | Aplicável apenas em desenvolvimento, no Windows. A versão corrigida só existe via Astro 7 |

**Porque não foram corrigidas as duas restantes.** Ambas as vias passam por `astro@7.3.3`,
ou seja, **subir duas versões maiores** a partir do 5.18. O aviso do `astro` cobre
literalmente todas as versões até à 7.2.7: não existe correção dentro do major 5. Isso é
uma migração — com alterações de API, de configuração e de comportamento a validar página a
página — e não uma correção de rotina. Trocar uma vulnerabilidade em grande medida não
aplicável por um build partido seria um mau negócio.

Fica registada como migração isolada, a fazer com verificação completa a seguir
(`npm run validar`, `build`, `qa`, `lint:links`, `audit:seo`, `audit:desempenho`,
`audit:csp`). Ver
[`docs/remediacao-da-auditoria.md`](../docs/remediacao-da-auditoria.md).

### Conteúdo publicado

A lista de associados (`associados.json`) é pública por decisão da associação e contém
número, indicativo e nome — **nenhum dado de contacto**. O `config.yml` avisa quem edita
disso mesmo. O correio eletrónico da associação é guardado em duas partes em `sitio.json` e
montado em build, para dificultar a recolha automática — uma medida contra spam, não uma
medida de segurança.

---

## Recomendações

Separadas do que está feito, por ordem de valor:

1. **Concluir a configuração do OAuth do CMS** e testar o fluxo real — hoje o `/admin/` não
   autentica em produção. Ver
   [`docs/decisoes-pendentes.md`](../docs/decisoes-pendentes.md#2-autenticação-do-cms-em-produção-oauth-do-github).
2. **Decidir a branch publicada** — o `config.yml` indica `main`, que não existe.
3. **Passar a CSP de `Report-Only` a impositiva**, depois de resolver o `'unsafe-inline'` e
   de confirmar contra o alojamento real. Ver
   [`docs/seguranca-csp.md`](../docs/seguranca-csp.md).
4. **Planear a migração do `astro` de 5 para 7**, com verificação completa a seguir. É o que
   resolve as duas vulnerabilidades restantes.
5. **Rever periodicamente quem tem acesso de escrita** ao repositório — é essa lista que
   define quem pode publicar no sítio.
6. **Considerar servir o Decap do próprio domínio**, em vez do CDN.

Já feitas: `npm audit` corre em integração contínua a cada *push*
(`.github/workflows/qualidade.yml`), como passo informativo.
