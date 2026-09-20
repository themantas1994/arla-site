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

### Sem Content-Security-Policy — NÃO IMPLEMENTADO

Não há cabeçalho `Content-Security-Policy`. É a lacuna mais relevante da lista. Não foi
acrescentado porque tem de ser afinado contra o alojamento real para não bloquear:

- as telas do OpenStreetMap (`tile.openstreetmap.org`);
- os painéis do HamQSL e do NOAA;
- o Decap CMS em `/admin/`, que carrega de `unpkg.com`;
- os scripts em linha de `Base.astro` (o que aplica o tema antes da primeira pintura) e o
  JSON-LD.

Uma CSP inicial teria de contemplar estes casos, provavelmente com `hash` para os scripts em
linha. É trabalho a fazer com acesso ao alojamento, não às cegas.

### Decap CMS carregado de um CDN

`public/admin/index.html` carrega
`https://unpkg.com/decap-cms@^3.8.4/dist/decap-cms.js` **sem Subresource Integrity**, e com
um intervalo de versões (`^3.8.4`) em vez de uma versão fixa. É o método recomendado pela
documentação do Decap, mas significa confiar no CDN e aceitar atualizações automáticas
dentro da versão maior. Quem entrar em `/admin/` é quem tem acesso de escrita ao
repositório, o que limita o impacto, mas não o anula.

### Vulnerabilidades em dependências

`npm audit` reporta, à data desta auditoria, **3 vulnerabilidades: 1 crítica, 1 alta, 1
baixa**:

| Pacote | Gravidade | Natureza | Aplicabilidade a este sítio |
| --- | --- | --- | --- |
| `astro` | Crítica | Conjunto de avisos de XSS (`define:vars`, atributos em spread, diretivas `transition:*`, nomes de slot), SSRF em página de erro pré-renderizada, RCE por otimização de imagens AVIF, e outros | **Maioritariamente não aplicável**: são vulnerabilidades de renderização por pedido, de server islands, de View Transitions e de otimização de imagens — nada disso é usado aqui. O build é estático e o HTML é gerado a partir de conteúdo do próprio repositório |
| `sharp` | Alta | Vulnerabilidades herdadas de `libvips` e `libheif` | Aplicável **apenas** a quem corra `scripts/otimizar-media.mjs` sobre imagens não fidedignas. Não corre no build nem em produção |
| `esbuild` | Baixa | Leitura arbitrária de ficheiros com o servidor de desenvolvimento no Windows | Aplicável apenas em desenvolvimento, no Windows |

A correção implica `npm audit fix --force`, que instalaria **versões maiores** de `astro` e
de `sharp` — uma migração, não uma correção de rotina. Está registada como dívida técnica e
como recomendação em
[`docs/auditoria-do-projeto.md`](../docs/auditoria-do-projeto.md#segurança), e **não foi
feita** nesta auditoria, que é de documentação.

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
   autentica em produção.
2. **Acrescentar uma `Content-Security-Policy`** afinada ao alojamento, começando em
   `report-only`.
3. **Fixar a versão do Decap CMS** e acrescentar `integrity` ao `<script>`, ou servir o
   ficheiro do próprio domínio.
4. **Planear a atualização de `astro` e `sharp`** para as versões maiores, com verificação
   completa (`npm run check`, `build`, `qa`, `lint:links`, `audit:seo`) a seguir.
5. **Rever periodicamente quem tem acesso de escrita** ao repositório — é essa lista que
   define quem pode publicar no sítio.
6. **Acrescentar `npm audit` a uma verificação periódica**, quando houver CI.
