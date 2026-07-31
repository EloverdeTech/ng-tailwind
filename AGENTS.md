# Instrucoes para Agentes

Comece por aqui antes de alterar biblioteca, demo, build ou documentacao.

## Resumo do projeto

- Biblioteca Angular `ng-tailwind` e app de documentacao/demo.
- O pacote usa Angular 19, ng-packagr, Tailwind, ESLint e scripts de build
  para biblioteca e documentacao.
- Mudancas na biblioteca podem afetar consumidores internos.

## Leia primeiro

1. `README.md`
2. `package.json`
3. `projects/ng-tailwind/`, quando a tarefa envolver a biblioteca
4. `src/app/`, quando a tarefa envolver documentacao ou demo
5. `docs/codex-review.md`, quando a tarefa for review automatico ou manual

## Locais principais

- `projects/ng-tailwind/`: codigo fonte da biblioteca.
- `src/app/`: documentacao/demo da biblioteca.
- `docs/`: documentacao e planos versionados.
- `dist/`: artefatos gerados de build.

## Code Review Rules

- Comente sempre em portugues do Brasil.
- Revise somente os arquivos e commits incluidos no ultimo push do autor.
- Priorize achados P0/P1, bloqueios e riscos concretos para API publica,
  compatibilidade Angular/Tailwind, consumidores, build, documentacao ou
  publicacao npm; nao repita alertas mecanicos cobertos por ESLint ou build.
- A branch canonica de producao deste repositorio e `master`. Quando houver
  PRs equivalentes para outras bases, revise a PR canonica e evite duplicar
  comentarios fora dela, salvo risco P0/P1 exclusivo daquele destino.
- Antes de concluir o review, use `docs/codex-review.md` como playbook
  especifico do Ng Tailwind.

## Restricoes

- Nao edite `dist/`, `.angular/`, `node_modules/` ou `coverage/` gerados.
- Nao altere versionamento, publicacao npm ou tags sem pedido explicito.
- Mudancas em API publica devem ser tratadas como risco de breaking change.

## Politica de ambiguidade

- Se codigo da biblioteca, demo e README divergirem, pergunte antes de
  consolidar uma regra como fato.
- Se a resposta ausente mudar API publica, compatibilidade, build ou
  publicacao, pare e pergunte.
