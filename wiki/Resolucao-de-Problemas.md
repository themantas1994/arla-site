# Resolução de Problemas

---

## Instalação e ambiente

### `npm install` falha

Confirme a versão do Node: `node -v` deve dar 20.3 ou superior (`engines.node`), e o projeto
é desenvolvido contra o 22 (`.nvmrc`). Com `nvm`, `nvm use`. Se a árvore de dependências
ficar inconsistente, apague `node_modules/` e use `npm ci`, que instala exatamente o que
está no `package-lock.json`.

### `npm audit` acusa vulnerabilidades

Reporta 3 (1 crítica, 1 alta, 1 baixa) em `astro`, `sharp` e `esbuild`. A correção implica
atualizações de versão maior. A análise de aplicabilidade a este sítio está em
[Segurança](Seguranca.md#vulnerabilidades-em-dependências) — a maioria diz respeito a
funcionalidades que este projeto não usa. **Não corra `npm audit fix --force` sem planear a
migração e voltar a passar todas as verificações.**

---

## Build e tipos

### `[InvalidContentEntryDataError]`

Um ficheiro de conteúdo não tem um campo obrigatório, ou tem um valor inválido num campo de
enum (`banda`, `estado`, `tipo`, `nivel`). A mensagem identifica a coleção, a entrada e o
campo:

```text
[InvalidContentEntryDataError] repetidores → cq0xpto
  banda: Invalid enum value. Expected 'VHF' | 'UHF' | 'SHF' | 'HF', received 'vhf'
```

**Não é uma avaria** — é o esquema Zod a impedir que dados incorretos sejam publicados.
Corrija o ficheiro. Ver [Coleções de Conteúdo](Colecoes-de-Conteudo.md).

### `npm run check` acusa erros de tipo

Corrija na origem. O projeto usa `astro/tsconfigs/strict` com `strictNullChecks` e não tem
supressões configuradas: um erro de tipo aponta normalmente para uma divergência real entre
um esquema e a forma como uma página o consome. As **sugestões** (`hints`) sobre importações
não usadas não bloqueiam.

### Os tipos das coleções parecem desatualizados

O Astro gera os tipos em `.astro/`. Apague esse diretório e volte a correr `npm run dev`.

### Não há linter

Não existe configuração de ESLint nem de Prettier no repositório. O `npm run check` é o
equivalente mais próximo.

---

## Pesquisa

### «A pesquisa diz que o índice não está disponível»

Se estiver em `npm run dev`: **é o esperado**. O Pagefind indexa o HTML gerado por
`npm run build` — em desenvolvimento esse índice não existe. Use
`npm run build && npm run preview`.

### A pesquisa não encontra nada no sítio publicado

Falta `dist/pagefind/` no alojamento. Ou o `npm run build` não chegou ao passo do Pagefind,
ou só foi publicada a saída do `astro build`. Corra o `npm run build` completo e publique
`dist/` por inteiro.

### O build mostra «has no `<html>` element»

São as 183 páginas-stub de redireção, que o Pagefind não consegue indexar por não terem
estrutura de documento completa. **Esperado, não é um problema.**

---

## Conteúdo e CMS

### As imagens não aparecem depois de as carregar pelo CMS

O Decap grava em `public/imagens/conteudo/` e referencia como `/imagens/conteudo/…`
(`media_folder` e `public_folder` em `public/admin/config.yml`). Um ficheiro colocado à mão
noutra pasta precisa que o caminho no campo seja ajustado.

### O CMS grava algo que o build recusa

O `public/admin/config.yml` e o `src/content.config.ts` descrevem os mesmos dados, e nada
verifica automaticamente que concordam. Um campo obrigatório no esquema Zod e ausente do
CMS, ou uma lista de `options` que não corresponde a um enum, produzem exatamente isto. Ver
[CMS Decap](CMS-Decap.md#manter-o-cms-e-o-esquema-alinhados).

### Um repetidor aparece na tabela mas desaparece ao filtrar

Falta-lhe a chave certa em `filtros`. Um repetidor DMR em UHF precisa de `uhf`, `dmr` e
`digital`. O esquema não o deteta, porque `filtros` tem predefinição `[]`.

### Um repetidor ou baliza não aparece no mapa

Ou não tem `quadricula` nem `coordenadas`, ou a quadrícula não passa na validação
(`^[A-R]{2}[0-9]{2}([A-X]{2})?$`), caso em que `quadriculaParaCoordenadas()` devolve `null`
e a estação é simplesmente ignorada — sem erro.

### Uma página nova em `src/content/paginas/` não tem endereço

**A coleção `paginas` não gera rotas.** As suas entradas são consumidas por páginas
específicas: `radioamadorismo/[pagina].astro` (através do mapa `ROTAS`), `arla/index.astro`
e `legal/aviso-legal.astro`. Ver [Rotas](Rotas.md#rotas-dinâmicas).

---

## Endereços e redireções

### Uma ligação interna dá 404

Provavelmente falta a barra final: o projeto usa `trailingSlash: 'always'`. Todos os
endereços internos terminam em `/`. O `npm run lint:links` apanha estes casos sobre o build.

### Uma redireção do sítio antigo não funciona

Os três ficheiros de redireções são mantidos à mão e podem estar dessincronizados. No
alojamento Apache atual, o que conta é o `public/.htaccess`; uma redireção que só exista em
`src/lib/redirects.mjs` fica a funcionar por `meta refresh` em vez de 301 real. Confirme
também que o `.htaccess` foi mesmo enviado — é um ficheiro oculto e muitos clientes de FTP
escondem-no. Ver [Redirecionamentos](Redirecionamentos.md).

### Renomeei um ficheiro de conteúdo e o endereço antigo deixou de funcionar

O nome do ficheiro é o slug. Acrescente a redireção nos três ficheiros.

---

## Mapa e recursos externos

### O mapa não carrega telas

A rede está a bloquear `tile.openstreetmap.org`. A lista de localizações em texto por baixo
do mapa continua a funcionar — é para isso que existe. Em ambientes com proxy, isto aparece
como `net::ERR_TOO_MANY_RETRIES` nos erros de consola do `npm run qa`: **é do ambiente, não
do sítio.**

### Os painéis de meteorologia espacial não aparecem

São imagens servidas pelo HamQSL e pelo NOAA, com `loading="lazy"`. Se os serviços não
responderem, ficam os textos alternativos e as ligações às fontes. A página continua
utilizável.

---

## Publicação

### O sítio não reflete uma alteração

1. **Não há publicação automática.** Confirme que alguém correu `npm run build` e publicou
   `dist/`. Uma alteração gravada no CMS fica no repositório e não chega ao sítio sozinha.
2. Force a atualização no navegador (`Ctrl`+`F5` / `Cmd`+`Shift`+`R`).
3. Limpe a cache da CDN, se existir.
4. Confirme no Git que a alteração ficou mesmo gravada.

### Os cabeçalhos de segurança não estão presentes

Só são enviados pelo Apache, a partir do `public/.htaccess`, e exigem o `mod_headers`.
Noutro alojamento, têm de ser replicados ao nível do servidor ou da CDN. Ver
[Segurança](Seguranca.md).

### O `/admin/` carrega mas não autentica

Faltam a aplicação OAuth do GitHub e o serviço de autenticação — **nenhum deles existe
ainda**. Localmente, use `npx decap-server` com `npm run dev`. Ver
[CMS Decap](CMS-Decap.md#autenticação--o-que-falta-configurar).

---

## QA

### `npm run qa` não arranca

Precisa do sítio servido: `npm run build && npm run preview &`. Precisa também de um
Chromium — os guiões usam `/opt/pw-browsers/chromium` quando existe, e respeitam
`CHROMIUM_PATH`; caso contrário, o Playwright usa o binário que tiver instalado
(`npx playwright install chromium`).

### `npm run lint:links` acusa ligações externas partidas

Com `-- --externas`, 14 delas estão dentro de artigos migrados e já estavam mortas no sítio
anterior: **não são para corrigir**, por decisão editorial. Outras duas (ANACOM, Facebook)
devolvem 403/400 a pedidos automatizados mas funcionam num navegador. Lista completa em
[`docs/qualidade.md`](../docs/qualidade.md#ligações).
