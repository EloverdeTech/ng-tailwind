# Plano Concluido: Orientar Codex Code Review do Ng Tailwind pelo AGENTS

**Status:** Concluido
**Criado em:** 2026-07-31
**Concluido em:** 2026-07-31
**ID:** 20260731-130642

## Objetivo

Criar orientacao versionada para o Codex Code Review no `ng-tailwind`,
adicionando `AGENTS.md` e `docs/codex-review.md` com regras especificas para
review da biblioteca Angular/NGT, documentacao, demo e publicacao npm.

## Contexto

### Pedido ou ticket original

- Origem: pedido direto do operador em conversa.
- Chave/link: nao ha ticket informado.
- Relato original: o operador autorizou criar estrutura de planos nos repos que
  faltavam e pediu planos de CodeReview automatico para os projetos do
  workspace.
- Atores afetados: mantenedores do `ng-tailwind`, consumidores internos da
  biblioteca e CodeReview automatico em PRs do repositorio.
- Criterios ou expectativa: comentarios em portugues do Brasil, review dos
  commits incluidos no ultimo push, foco em riscos concretos e `prod` como
  branch canonica quando houver PRs equivalentes.

### Analise automatizada

- Veredito: o repositorio nao tinha `AGENTS.md` nem docs de review; a estrutura
  de planos foi criada neste fluxo.
- Causa raiz indicada: o review automatico precisa de regras versionadas para
  uma biblioteca compartilhada, com foco em compatibilidade e publicacao.
- Comportamento esperado: criar `AGENTS.md` com `## Code Review Rules` e
  apontar para `docs/codex-review.md`.
- Limites da analise: este plano nao altera componentes, package version,
  build, dist ou publicacao npm.

### Evidencias consultadas

| Fonte | Evidencia | Uso no plano |
|---|---|---|
| `scripts/status-brief.php` | Branch `merge_master_into_ngt_reactive_components`, commit `b556015`, `docs/` novo no status | Snapshot factual |
| `README.md` | Fluxo de publicacao npm e documentacao do NgTailwind | Contexto operacional |
| `package.json` | Angular 19, ng-packagr, scripts `build`, `build-ngt`, `lint`, `test` | Stack e validacao |
| `.gitignore` | Ignora `dist`, `.angular`, `coverage`, `node_modules` e outputs | Artefatos fora do review |
| `projects/ng-tailwind` | Codigo da biblioteca | Escopo principal |
| `src/app` | App de documentacao/demo | Escopo de docs/demo |

### Snapshot do repositorio

- Repositorio: `/Users/choviski/Desktop/Pogramas/ng-tailwind`.
- Branch: `merge_master_into_ngt_reactive_components`.
- Commit: `b556015`.
- Alteracoes locais ligadas a este fluxo: criacao de `docs/plans/*`.

## Escopo

Inclui:

- Criar `AGENTS.md` raiz com instrucoes curtas do projeto.
- Incluir `## Code Review Rules` no `AGENTS.md`.
- Criar `docs/codex-review.md` com checklist para:
  - componentes e APIs publicas da biblioteca;
  - breaking changes para consumidores;
  - compatibilidade Angular, Tailwind e ng-packagr;
  - documentacao/demo em `src/app`;
  - versionamento e publicacao npm;
  - lint, build de biblioteca e build de documentacao.

Nao inclui:

- Alterar codigo da biblioteca, demo, package version ou publicacao.
- Editar `dist`, `.angular`, `coverage`, `node_modules` ou outputs gerados.
- Criar configuracao remota do Codex.

## Impacto em permissoes

- Classificacao: Nao aplicavel.
- Justificativa: a mudanca planejada altera apenas documentacao e instrucoes de
  review; nao muda acesso, roles, autenticacao, deploy ou publicacao npm.
- Dados e rollout: sem migration, seed, default ou backfill.
- Testes de permissao: nao aplicaveis.

## Status por bloco

| Bloco | Tema | Status |
|---|---|---|
| 1 | Criar `AGENTS.md` com regras gerais de Code Review | Concluido |
| 2 | Criar `docs/codex-review.md` do Ng Tailwind | Concluido |
| 3 | Validar referencias e diff | Concluido |

## Passos de implementacao

1. Criar `AGENTS.md` com resumo, diretorios principais, restricoes e
   `## Code Review Rules`.
2. Registrar idioma portugues, ultimo push, branch canonica `prod`, foco em
   riscos concretos e link para `docs/codex-review.md`.
3. Criar `docs/codex-review.md` com fontes obrigatorias `README.md`,
   `package.json`, `.gitignore`, `projects/ng-tailwind` e `src/app`.
4. Definir checklist de review para API publica, components, styling,
   compatibilidade, docs, build e publicacao.
5. Validar referencias e diff.

## Decisoes

- Como nao existe `AGENTS.md`, a implementacao devera criar o arquivo raiz.
- O review deve comentar em portugues do Brasil.
- O recorte do review automatico sera os commits incluidos no ultimo push.
- Em PRs equivalentes, a branch canonica sera `prod`.

## Criterios de aceite

- [x] `AGENTS.md` existe e contem `## Code Review Rules` com link para
  `docs/codex-review.md`.
- [x] `docs/codex-review.md` existe e cobre biblioteca Angular, API publica,
  componentes, Tailwind, docs/demo, build e publicacao npm.
- [x] Nenhum artefato gerado foi alterado.

## Validacao

- `git status --short`.
- `git diff -- AGENTS.md docs/codex-review.md docs/plans`.
- `rg -n "Code Review Rules|codex-review|ultimo push|prod|portugues|ng-tailwind|Angular|npm" AGENTS.md docs/codex-review.md`.
- `npm run lint` e `npm run build-ngt`, quando houver mudanca futura na
  biblioteca.

## Documentation gaps

- O repositorio nao tinha `AGENTS.md` nem docs de harness/coding standards no
  snapshot consultado.
- A configuracao remota do Codex Code Review nao e versionada neste repositorio.

## Log

- [2026-07-31]: Estrutura `docs/plans/active` e `docs/plans/completed` criada
  por autorizacao do operador.
- [2026-07-31]: Plano criado e preenchido para o contexto da biblioteca
  NgTailwind.

- [2026-07-31]: Implementacao concluida; arquivos versionados atualizados, referencias validadas e plano movido para `docs/plans/completed`.
