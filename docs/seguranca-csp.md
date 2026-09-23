# Content-Security-Policy

**Estado: implementada em `Report-Only`.** Está a ser servida, é testada
automaticamente, e **não bloqueia nada**.

A auditoria de 20 de setembro de 2026 apontou a ausência de CSP como a lacuna de segurança
mais relevante do projeto. A remediação acrescentou-a — mas em modo de relatório, não de
imposição, e este documento explica porquê e o que falta para a impor.

---

## O que está a ser servido

Em `public/.htaccess`, dentro de `<IfModule mod_headers.c>`:

```apache
Header always set Content-Security-Policy-Report-Only "…"
```

A política em si vive em **`scripts/lib/csp.mjs`**, que é a fonte única. A linha do
`.htaccess` é uma cópia, e `npm run audit:csp` falha se as duas divergirem — para não
acontecer estar a testar-se uma política e a servir-se outra.

| Diretiva | Valor | Porquê |
| --- | --- | --- |
| `default-src` | `'self'` | tudo o que não estiver explicitamente aberto fica fechado |
| `script-src` | `'self' 'unsafe-inline' 'wasm-unsafe-eval' unpkg.com` | ver limitação abaixo; `wasm` é a pesquisa (Pagefind); `unpkg` é o Decap em `/admin/` |
| `style-src` | `'self' 'unsafe-inline'` | o Leaflet posiciona as telas por atributo `style` |
| `img-src` | `'self' data: blob: tile.openstreetmap.org www.hamqsl.com services.swpc.noaa.gov` | telas dos mapas e painéis de meteorologia espacial |
| `connect-src` | `'self' api.github.com unpkg.com` | o Pagefind lê o índice do próprio sítio; o Decap grava pela API do GitHub |
| `font-src`, `media-src` | `'self'` | não há tipos de letra nem vídeo externos |
| `frame-src`, `object-src` | `'none'` | o sítio não embebe nada |
| `frame-ancestors` | `'self'` | ninguém pode embeber o sítio (anti-*clickjacking*) |
| `form-action` | `'self' github.com` | o único destino de formulário é o OAuth, a partir de `/admin/` |
| `base-uri` | `'self'` | impede a injeção de um `<base>` que redirecione todos os caminhos relativos |

As origens externas foram **levantadas do build**, não presumidas. O teste encontrou uma
que a leitura do código tinha deixado passar — `services.swpc.noaa.gov`, a imagem de
síntese da NOAA em `/radioamadorismo/meteorologia-espacial/` — e é exatamente por isso que
não se impõe uma CSP sem a testar.

---

## Como é testada

```bash
npm run build
npx astro preview --port 4321 &
npm run audit:csp
```

`scripts/auditar-csp.mjs` **não** se fia no modo `Report-Only`. Interceta cada resposta
HTML num navegador real e injeta a mesma política como `Content-Security-Policy`
impositiva, percorre as 15 páginas com mais dependências externas — incluindo `/admin/`,
os mapas, a meteorologia espacial e a pesquisa — e conta o que ficaria bloqueado.

Sair com 0 significa: **se a política passar a impositiva, nada se parte**.

Última execução: 15 páginas, 0 violações.

---

## O que falta para a impor

Duas coisas, uma técnica e uma organizacional.

### 1. A limitação real: `'unsafe-inline'` em `script-src`

Com `'unsafe-inline'`, a CSP **não protege contra XSS injetado em linha**, que é o ataque
principal de que uma CSP costuma defender. Continua a valer a pena — fecha origens
externas, `eval`, `<base>`, formulários para fora e o embebimento do sítio — mas é preciso
ser claro sobre o que faz e o que não faz.

A causa é o Astro, que produz `<script type="module">` em linha em várias páginas, e o
guião do tema em `src/layouts/Base.astro`, que **tem** de correr antes da primeira pintura
para não haver salto de cor ao carregar.

Saídas possíveis, por ordem de esforço:

- **Hashes.** Calcular o `sha256` de cada `<script>` em linha do `dist/` e listá-los na
  política. Como o conteúdo muda a cada build, a política teria de ser gerada no build e
  escrita no `.htaccess` — o que é viável, mas acrescenta um passo que tem de correr
  sempre, sob pena de o sítio ficar sem scripts.
- **Nonces.** Não servem: exigem um valor diferente por pedido, e o sítio é estático.
- **Eliminar os scripts em linha.** Possível para os do Astro; impossível para o do tema
  sem reintroduzir o salto de cor.

### 2. Confirmar contra o alojamento real

O `.htaccess` só é lido por Apache. Num alojamento que não seja Apache — Netlify,
Cloudflare Pages, Vercel — **nenhum destes cabeçalhos é aplicado**, e a CSP não existe.
Ver a decisão 3 em [`decisoes-pendentes.md`](decisoes-pendentes.md).

Antes de impor, convém ainda recolher relatórios reais durante algum tempo, com um
`report-uri`/`report-to` a apontar para um serviço de recolha, para apanhar o que o teste
automático não cobre (navegadores diferentes, extensões, páginas menos visitadas).

---

## Passar a impositiva

Quando as duas condições acima estiverem satisfeitas, em `public/.htaccess`:

```diff
-  Header always set Content-Security-Policy-Report-Only "…"
+  Header always set Content-Security-Policy "…"
```

`npm run audit:csp` passa a reportar `IMPOSITIVA` no cabeçalho do relatório. **Corra-o
antes e depois**, e confirme à mão os mapas, a pesquisa e o `/admin/` no sítio publicado.

Se alguma coisa se partir, voltar a `Report-Only` é uma linha — e é sempre a resposta
certa, porque uma CSP a bloquear o Leaflet não dá erro visível: o mapa simplesmente não
aparece.
