# Implantação

Como pôr o sítio no ar. **A publicação é hoje inteiramente manual** — a automatização é uma
proposta, descrita mais abaixo, não algo em funcionamento.

---

## O que é preciso

- **Node.js 20.3 ou superior** (a versão usada está em `.nvmrc`)
- Um sítio onde servir ficheiros estáticos
- Uma conta GitHub, se quiser o editor de conteúdos em `/admin/`

Não há base de dados, não há PHP, não há processo a correr em permanência. O resultado do
build é uma pasta de ficheiros.

---

## Build de produção

```bash
npm ci                # instalação limpa, a partir do package-lock.json
npm run build         # gera dist/
```

O `npm run build` faz duas coisas: constrói o sítio com o Astro e, a seguir, o Pagefind
percorre o HTML gerado e cria o índice de pesquisa em `dist/pagefind/`. **Um sem o outro
não chega** — se saltar o Pagefind, a pesquisa deixa de funcionar.

Se o sítio for publicado noutro domínio, defina a origem canónica:

```bash
PUBLIC_SITE_URL=https://www.exemplo.pt npm run build
```

Isto afeta os endereços canónicos, o Open Graph, o sitemap e o RSS.

### Verificar antes de publicar

```bash
npm run check         # tipos
npm run preview &     # servidor local em http://localhost:4321
npm run lint:links    # ligações partidas
npm run qa            # acessibilidade, responsivo e testes funcionais
```

---

## Publicar

### Alojamento atual (Apache / cPanel)

A hipótese mais provável, por ser onde o WordPress está hoje.

1. `npm run build`
2. Envie **todo o conteúdo de `dist/`** para a raiz pública (`public_html/` ou equivalente).
3. Confirme que o `.htaccess` foi junto — é um ficheiro oculto e muitos clientes de FTP
   escondem-no. **Sem ele não há redireções 301 nem cabeçalhos de segurança.**
4. Confirme que o `mod_rewrite` e o `mod_headers` estão ativos. Na maioria dos alojamentos
   partilhados estão.

**Sobre a pasta `/site/` do WordPress:** guarde uma cópia de segurança completa antes de
mexer. Depois de confirmar que o sítio novo funciona e que as redireções respondem, a
instalação antiga pode ser removida — as redireções tratam das moradas antigas. Não há
pressa nenhuma nisto.

### Netlify ou Cloudflare Pages

Ligue o repositório e configure:

| Definição | Valor |
| --- | --- |
| Comando de build | `npm run build` |
| Pasta a publicar | `dist` |
| Versão do Node | `22` |

O `public/_redirects` é reconhecido automaticamente. Cada envio para a branch principal
publica uma nova versão.

### Vercel

O mesmo comando e a mesma pasta. As redireções do `_redirects` não são lidas pela Vercel —
mas as páginas de redireção que o Astro gera continuam a funcionar, pelo que nenhuma
morada antiga fica partida. Para obter 301 reais, acrescente um `vercel.json` com as
regras convertidas a partir de `src/lib/redirects.mjs`.

### GitHub Pages

Funciona, com uma limitação: o GitHub Pages não suporta redireções ao nível do servidor.
As moradas antigas continuam a funcionar através das páginas de redireção geradas pelo
Astro, mas com `meta refresh` em vez de 301 — ligeiramente pior para o posicionamento nos
motores de busca. Para um sítio com dez anos de ligações acumuladas, prefira uma opção
com 301 reais.

---

## Publicação automática — NÃO IMPLEMENTADA

**Não existe atualmente um pipeline CI/CD automatizado neste repositório.** Não há
diretório `.github/`, nem workflows do GitHub Actions, nem qualquer outro sistema de
integração contínua. Hoje, publicar é um processo manual: correr `npm run build` e enviar
o conteúdo de `dist/` para o alojamento.

O que se segue é uma **proposta** — um ponto de partida para quem venha a automatizar a
publicação, a colocar em `.github/workflows/publicar.yml`. Não está em funcionamento:

```yaml
name: Publicar
on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  publicar:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - run: npm run lint:links
      # Substituir pelo passo de publicação do alojamento escolhido.
      - uses: actions/upload-artifact@v4
        with:
          name: sitio
          path: dist
```

O `npm run lint:links` no fim é uma rede de segurança barata: se uma alteração de conteúdo
criar uma ligação partida, o build falha antes de chegar ao público.

Enquanto esta proposta não for implementada, **cada alteração gravada no CMS fica no
repositório sem chegar ao sítio** até alguém publicar à mão. Vale a pena ter isto presente
ao explicar o fluxo a quem edita.

---

## Configurar o editor de conteúdos

> **ESTADO: PARCIALMENTE IMPLEMENTADO.**
>
> O que está feito, no repositório: o `config.yml` está completo e coerente com os
> esquemas de conteúdo (verificado por `npm run validar:esquemas`), o `repo` aponta para o
> repositório real, os caminhos de media estão certos, o editor carrega de uma versão fixa
> do Decap com Subresource Integrity, e o backend local funciona.
>
> O que falta, **tudo fora do repositório e nada disto derivável do código**:
>
> 1. a **aplicação OAuth do GitHub** e o **serviço de autenticação** (passos 2 e 3 abaixo);
> 2. a decisão sobre qual é a **branch publicada** (passo 1).
>
> Até os dois estarem feitos e testados com uma gravação real, **o `/admin/` carrega mas
> não autentica** e o fluxo de publicação a partir do CMS **não está operacional**. Ver
> [`decisoes-pendentes.md`](decisoes-pendentes.md).

O Decap CMS grava no repositório através da API do GitHub, e precisa de uma aplicação
OAuth para autenticar quem edita.

### 1. Apontar ao repositório certo — e escolher a branch

Em `public/admin/config.yml`:

```yaml
backend:
  name: github
  repo: themantas1994/arla-site   # ← já está certo: é o repositório real
  branch: main                    # ← POR DECIDIR: esta branch NÃO EXISTE
```

⚠ **O repositório não tem nenhuma branch chamada `main`.** As branches existentes são
todas de trabalho (`claude/…`) e a predefinida é `claude/arla-website-redesign-vcemm3`.
Com o CMS a funcionar, gravar daria erro.

O valor não foi corrigido de propósito: qual é a branch publicada do sítio da ARLA é uma
decisão da associação. Escolha uma das duas vias e mude **só essa linha**:

| Via | O que fazer | Consequência |
| --- | --- | --- |
| a) criar `main` | `git branch main <branch-publicada>` e `git push -u origin main`; depois pô-la como predefinida em **Settings → Branches** | o `config.yml` fica como está |
| b) usar o nome atual | escreva em `branch:` o nome da branch publicada | nada mais muda |

`npm run validar:esquemas` avisa sempre que a branch indicada não existir no repositório.

### 2. Criar a aplicação OAuth

Em **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**:

| Campo | Valor |
| --- | --- |
| Application name | `ARLA CMS` |
| Homepage URL | `https://www.cs5arla.pt` (o domínio de produção real) |
| Authorization callback URL | `https://<serviço-de-autenticação>/callback` (passo 3) |

Guarde o *Client ID* e o *Client Secret*. **O *secret* nunca entra no repositório** — vive
só nas variáveis de ambiente do serviço de autenticação. Não há nenhum sítio neste
repositório onde ele deva ser colado, e nenhum ficheiro `.env` é lido em produção.

**Permissões do GitHub necessárias.** A aplicação OAuth pede o âmbito `repo`, que dá
leitura e escrita no repositório. Quem autorizar a aplicação passa a poder gravar tudo
aquilo a que já tem acesso — a aplicação não amplia permissões, só as usa. Por isso:

- quem edita tem de ter acesso **Write** ao repositório (passo «Dar acesso de edição»);
- se o repositório for da conta pessoal de alguém, considere passá-lo para uma organização
  da associação antes de abrir o CMS a mais pessoas;
- rever periodicamente a lista de colaboradores é o controlo de acesso do sítio.

### 3. Serviço de autenticação

O GitHub exige que a troca do código de autorização por um *token* seja feita num servidor
— não pode acontecer no navegador, porque implicaria expor o *Client Secret*. O alojamento
atual (Apache/cPanel com ficheiros estáticos) **não serve para isto**: é preciso algo que
corra código.

Duas opções habituais:

- **Netlify** — traz o *Git Gateway* incluído; basta ativá-lo e mudar o `backend` para
  `name: git-gateway`. É o caminho mais simples.
- **Qualquer outro alojamento** — use um serviço de OAuth para Decap (há implementações
  pequenas para Cloudflare Workers e para Netlify Functions) e acrescente ao `config.yml`:

  ```yaml
  backend:
    name: github
    repo: themantas1994/arla-site
    branch: main
    base_url: https://autenticacao.exemplo.pt
  ```

Depois de qualquer das opções, **teste o fluxo real antes de o dar por operacional**:
entrar em `https://<domínio>/admin/`, autenticar com o GitHub, gravar uma alteração de
teste e confirmar que aparece um commit no repositório, na branch escolhida no passo 1.
Enquanto esse teste não passar, o CMS em produção continua por configurar.

### Experimentar localmente

Sem configurar nada disto:

```bash
npx decap-server        # num terminal
npm run dev             # noutro
```

Abra `http://localhost:4321/admin/`. O `local_backend: true` no `config.yml` faz o editor
gravar diretamente nos ficheiros locais. É a melhor forma de experimentar sem risco.

### Dar acesso de edição a alguém

Quem tem acesso de escrita ao repositório no GitHub pode entrar no CMS. Para dar acesso:
**GitHub → repositório → Settings → Collaborators → Add people**, com permissão *Write*.

Para retirar acesso, remova a pessoa da mesma lista. Nada mais é preciso — não há contas
nem palavras-passe próprias do sítio.

---

## Segurança

O que está feito:

- **Sem segredos no repositório.** Nenhuma chave de API, nenhuma credencial, nenhum token.
- **Sem base de dados e sem código a correr no servidor.** A superfície de ataque de um
  WordPress — plugins por atualizar, `wp-admin` exposto, injeção de SQL — desaparece.
- **Autenticação delegada ao GitHub**, com OAuth. O sítio nunca vê nem guarda palavras-passe.
- **Cabeçalhos de segurança** no `.htaccess`: `X-Content-Type-Options`, `Referrer-Policy`,
  `X-Frame-Options`, `Permissions-Policy` e `Strict-Transport-Security`.
- **Sem HTML de utilizador por sanear.** Todo o conteúdo passa pelo processador de Markdown
  do Astro durante o build, por quem tem acesso de escrita ao repositório.
- **Ligações externas** com `rel="noopener noreferrer"`.
- **`/admin/` e `/area-reservada/` bloqueados** no `robots.txt`.

- **Editor do CMS com versão fixa e Subresource Integrity.** `public/admin/index.html`
  carrega uma versão exata do Decap com `integrity` e `crossorigin`; um ficheiro trocado no
  CDN é recusado pelo navegador.
- **Content-Security-Policy em modo `Report-Only`** no `.htaccess` — ver
  [`seguranca-csp.md`](seguranca-csp.md).

Se acrescentar cabeçalhos noutro alojamento, **replique todos os do `.htaccess`**,
incluindo a CSP: fora do Apache, nenhum deles é aplicado.

---

## Resolução de problemas

### Quando o sítio não atualiza

1. Confirme que o build foi mesmo corrido e publicado: **não há publicação automática**
   neste projeto (ver acima). Se usar um alojamento com build próprio — Netlify,
   Cloudflare Pages — veja o painel desse serviço.
2. Force a atualização no navegador: `Ctrl`+`F5`.
3. Se usar CDN ou Cloudflare, limpe a cache.
4. Confirme que a alteração ficou mesmo gravada: procure o *commit* no GitHub.

### «A pesquisa não encontra nada»

O índice é gerado pelo Pagefind no fim do `npm run build`. Se publicou só a saída do
`astro build`, falta-lhe `dist/pagefind/`. Corra `npm run build` completo e volte a publicar.

### O build falha com erro de validação de conteúdo

É o comportamento pretendido: alguma alteração deixou um campo obrigatório por preencher ou
com um valor inválido. A mensagem diz o ficheiro e o campo. Exemplo:

```
[InvalidContentEntryDataError] eventos → workshop-2026
  inicio: Required
```

Preencha o campo em falta e volte a gravar.

### As imagens não aparecem depois de as carregar pelo CMS

O CMS guarda em `public/imagens/conteudo/` e referencia como `/imagens/conteudo/…`.
Se tiver colocado ficheiros à mão noutra pasta, o caminho tem de ser ajustado no campo
correspondente.
