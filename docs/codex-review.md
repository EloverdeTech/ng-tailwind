# Codex Code Review

Este playbook orienta o Codex Code Review automatico no GitHub para o
`ng-tailwind`. Use-o junto do `AGENTS.md` antes de concluir qualquer review.

## Escopo automatico

- Comente sempre em portugues do Brasil.
- Revise somente os arquivos e commits incluidos no ultimo push do autor.
- Ignore merge commits e nao reabra achados ja comentados em pushes
  anteriores, salvo quando o risco mudou.
- A branch canonica de producao deste repositorio e `master`. Em PRs
  equivalentes para outras bases, comente apenas risco P0/P1 exclusivo daquele
  destino.
- Foque em API publica, compatibilidade Angular/Tailwind, componentes,
  estilos, docs/demo, build e publicacao npm.

## Fontes obrigatorias

- `README.md`
- `package.json`
- `.gitignore`
- `projects/ng-tailwind/`
- `src/app/`

## Severidade

- `Bloqueio`: breaking change nao documentado, API publica quebrada,
  incompatibilidade Angular/Tailwind, build de biblioteca falhando, demo
  divergente, publicacao/versionamento incoerente ou artefato gerado indevido.
- `Atencao`: risco relevante com escopo limitado ou mitigacao clara.
- `Sugestao`: melhoria objetiva alinhada ao stack local.
- `Duvida`: informacao ausente que pode alterar o veredito.

Use `Request Changes` somente quando houver ao menos um `Bloqueio`.

## Checklist Biblioteca

- API publica: revise exports, inputs/outputs, tipos, defaults, nomes e
  compatibilidade com consumidores existentes.
- Componentes: confira lifecycle, change detection, subscriptions, eventos,
  acessibilidade e estado visual.
- Styling: preserve tokens/classes Tailwind esperadas, responsividade e
  compatibilidade com apps consumidores.
- Angular/ng-packagr: valide packaging, peer dependencies, build da biblioteca,
  tree shaking e paths publicos.
- Docs/demo: `src/app` deve demonstrar comportamento real da biblioteca quando
  a API publica mudar.
- Versionamento: mudancas breaking exigem decisao explicita de versionamento e
  publicacao.
- Validacao: use `npm run lint` e `npm run build-ngt` quando a biblioteca for
  alterada.

## Nao comentar

- Artefatos `dist/`, `.angular/`, `node_modules/` ou `coverage/` gerados, salvo
  se aparecerem indevidamente no diff.
- Preferencias genericas de UI sem risco para consumidores.
- Codigo correto apenas para elogiar.

## Formato dos achados

Liste achados primeiro, ordenados por severidade, com categoria,
arquivo/referencia, risco concreto e caminho pratico de correcao.

Finalize com:

```md
### Status da Revisao: Approve|Comment|Request Changes
```
