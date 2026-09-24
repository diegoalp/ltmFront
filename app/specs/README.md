# Specs (Spec-Driven Development)

Toda feature nova ou mudança de comportamento relevante começa com uma spec
neste diretório, escrita **antes** do código.

## Fluxo

1. Copie `TEMPLATE.md` para `specs/<slug-da-feature>.md` (ex:
   `specs/motivos-perda-tipo.md`).
2. Preencha objetivo, requisitos e critérios de aceite. Mantenha curto —
   o objetivo é alinhar antes de codar, não documentar exaustivamente.
3. Se a mudança altera contrato de API (payload, rota, resposta), documente
   o formato esperado na seção "Contrato de API".
4. Peça revisão da spec antes de começar a implementação.
5. Referencie o arquivo da spec na descrição do PR.
6. Ao final, use a seção "Critérios de aceite" como checklist de QA manual
   antes de fechar a task.

## Quando pular a spec

Fixes triviais, ajustes de estilo/copy e mudanças sem impacto de
comportamento não precisam de spec.
