# Specs

This directory holds the product and implementation specs used for
spec-driven development.

## Folder Naming

Use a numeric prefix and short kebab-case name:

```text
specs/
└── 001-edit-business-cards/
    ├── spec.md
    ├── plan.md
    ├── tasks.md
    └── checklist.md
```

## Starting A Feature

1. Create a folder: `specs/NNN-short-name`.
2. Copy templates from `.specify/templates`.
3. Fill `spec.md` first.
4. Fill `plan.md` before editing application code.
5. Track implementation in `tasks.md`.

## Template Files

- `.specify/templates/spec-template.md`
- `.specify/templates/plan-template.md`
- `.specify/templates/tasks-template.md`
- `.specify/templates/checklist-template.md`

Technical documentation should be written in English. User-facing copy described
inside a spec should be written in Portuguese.
