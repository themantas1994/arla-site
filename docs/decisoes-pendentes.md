# Decisões pendentes da direção da ARLA

Estas cinco decisões **não se tiram do código**. Não foram tomadas na remediação da
auditoria de 20 de setembro de 2026, de propósito: pertencem à associação, e inventá-las
para o projeto parecer completo seria pior do que deixá-las em aberto.

Cada uma diz o que está por decidir, o que acontece enquanto não for decidida, e o que é
preciso mexer depois de o ser.

---

## 1. Qual é a branch publicada do sítio

**Referência da auditoria:** DOC-020 · **Impede:** o CMS em produção

`public/admin/config.yml` indica `branch: main`, e **o repositório não tem nenhuma branch
com esse nome**. As branches existentes são todas de trabalho (`claude/…`) e a predefinida
é `claude/arla-website-redesign-vcemm3`.

**Enquanto não for decidida:** o Decap CMS, quando a autenticação estiver configurada,
falha ao gravar — tenta escrever numa branch que não existe. O fluxo de publicação a partir
do editor **não está operacional** e não deve ser anunciado como estando.

**Depois de decidida**, uma de duas vias:

| Via | Comandos | O que muda no repositório |
| --- | --- | --- |
| a) criar `main` | `git branch main <branch-publicada>`<br>`git push -u origin main`<br>depois: **Settings → Branches → Default branch** | nada — o `config.yml` já diz `main` |
| b) usar o nome atual | — | uma linha: `branch:` em `public/admin/config.yml` |

Em qualquer das vias, atualizar também [`implantacao.md`](implantacao.md).
`npm run validar:esquemas` avisa enquanto a branch indicada não existir.

---

## 2. Autenticação do CMS em produção (OAuth do GitHub)

**Referência da auditoria:** DOC-002, «PARCIALMENTE IMPLEMENTADO» · **Impede:** o CMS em produção

O que está feito no repositório está feito e verificado. O que falta é **infraestrutura
fora do repositório** e ninguém a pode criar a partir daqui:

- uma **aplicação OAuth do GitHub** (Client ID e Client Secret);
- um **serviço de autenticação** que troque o código de autorização por um *token* — o
  alojamento atual serve ficheiros estáticos e não corre código, por isso não serve;
- o **domínio de produção** a usar no *callback*;
- a confirmação de quem deve ter acesso **Write** ao repositório, que é o que define quem
  pode publicar.

Passo a passo em [`implantacao.md`](implantacao.md#configurar-o-editor-de-conteúdos).

**Nenhum segredo deve ser commitado.** O *Client Secret* vive nas variáveis de ambiente do
serviço de autenticação e em mais lado nenhum.

**A decisão só está tomada depois de testada:** entrar em `/admin/`, autenticar, gravar
uma alteração de teste e ver o commit aparecer na branch escolhida na decisão 1.

---

## 3. A publicação continua manual ou passa a automática

**Referência da auditoria:** DOC-005 · **Impede:** nada; é uma escolha de processo

Hoje a publicação é manual: `npm run build` e envio de `dist/` para o alojamento. Existe
agora integração contínua (`.github/workflows/qualidade.yml`) que **verifica** cada
alteração — tipos, testes, build, ligações, acessibilidade, SEO, desempenho e CSP — mas
**não publica nada**. Isso foi deliberado: publicar exige credenciais do alojamento e
uma decisão sobre quem controla a publicação.

| Opção | O que implica |
| --- | --- |
| **Manter manual** | continua a ser preciso alguém com o projeto instalado; uma alteração do CMS pode ficar dias sem chegar ao sítio |
| **Automatizar sobre o alojamento atual** | guardar credenciais de FTP/SSH do cPanel como *secrets* do GitHub e acrescentar um passo de envio ao workflow |
| **Mudar para Netlify ou Cloudflare Pages** | publicação automática incluída, `_redirects` lido sem configuração, e o Git Gateway resolve também a decisão 2 — em troca de mudar de alojamento |

Enquanto for manual, a documentação tem de continuar a dizê-lo com todas as letras. Não
escrever que o sítio se atualiza sozinho.

---

## 4. Licença do código

**Referência da auditoria:** DT-013 · **Impede:** clareza jurídica sobre reutilização

Não existe ficheiro `LICENSE`, e **nenhum foi acrescentado**: escolher uma licença é uma
decisão da direção, com efeitos jurídicos, não uma correção técnica.

**Consequência prática de não haver licença:** por omissão, o código está integralmente
protegido por direitos de autor. Ninguém de fora pode legalmente copiar, modificar,
redistribuir ou reutilizar o código do sítio — nem outra associação de radioamadores que o
queira usar como base. Contribuições externas ficam também numa situação indefinida.

Note-se que isto diz respeito ao **código**. O **conteúdo** (textos, fotografias, dados da
rede) é matéria distinta e pode ter licença própria, ou nenhuma.

| Opção | Efeito |
| --- | --- |
| **Não fazer nada** | mantém-se o estado atual: tudo reservado, por omissão |
| **Licença permissiva** (MIT, BSD-2) | qualquer pessoa pode reutilizar, mesmo comercialmente, mantendo a atribuição |
| **Licença recíproca** (GPL-3.0, AGPL-3.0) | quem reutilizar tem de publicar as suas alterações |
| **Só o conteúdo** (CC BY-SA para textos, código reservado) | divulga o conteúdo da associação sem abrir o código |

Decidido o que for, o ficheiro `LICENSE` vai para a raiz do repositório e a decisão fica
registada no `README.md`.

---

## 5. Confirmação dos dados institucionais

**Referência:** [`carece-de-verificacao.md`](carece-de-verificacao.md) · **Impede:** confiar no que está publicado

Vários factos publicados vieram do sítio anterior e **não foram verificados contra nenhuma
fonte da associação** — nem pela auditoria, nem por esta remediação, que não alterou um
único dado institucional. Entre eles: o mandato dos órgãos sociais, o valor da quota anual
e o IBAN.

Nada disto se resolve a partir do código: são factos que só alguém da direção pode
confirmar. A lista completa, com a origem de cada um, está em
[`carece-de-verificacao.md`](carece-de-verificacao.md).

`npm run validar:dados` confirma que os dados têm a **forma** certa — que o IBAN parece um
IBAN português, que o código postal tem o formato certo, que cada membro dos órgãos sociais
tem cargo, nome e número. **Não confirma que os valores estejam certos**, e não há guião
que o possa fazer.

---

## Resumo

```text
1. Branch publicada ................ POR DECIDIR — bloqueia o CMS em produção
2. OAuth do CMS em produção ........ POR CONFIGURAR (fora do repositório)
3. Publicação manual ou automática . POR DECIDIR — processo
4. Licença do código ............... POR DECIDIR — jurídico
5. Dados institucionais ............ POR CONFIRMAR pela direção
```
