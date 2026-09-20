# LTM CRM Frontend

CRM frontend built with Nuxt 4, Vue 3, TypeScript, and Tailwind CSS. The application communicates with the Laravel project in `../ltmApi` exclusively through Nuxt server routes, keeping the API key out of the browser.

## Running locally

1. Start `ltmApi` at `http://127.0.0.1:8000`.
2. Copy `.env.example` to `.env` and configure the same `API_KEY` used by Laravel.
3. Run `npm install` and `npm run dev`.

## Architecture

```text
app/
├── components/       reusable visual components
├── composables/      domain state and interaction rules
├── repositories/     API transport and payloads, without visual state
├── middleware/       authentication and navigation rules
├── pages/            route and screen composition
├── stores/           global Pinia state
└── types/
    ├── api.ts         raw Laravel contracts
    └── crm.ts         models consumed by the UI
server/
├── api/               one explicit route per Laravel resource
└── utils/laravel.ts   shared authentication, tenant, and transport logic
```

The expected flow is `page/component → domain composable → repository → useApi → Nuxt resource route → Laravel`. Do not call Laravel directly from pages or components.

Code identifiers, comments, and technical documentation must be written in English. Portuguese is reserved for user-facing copy and legacy values required by persisted data or API contracts.

## Commands

```bash
npm run dev       # development server
npm run build     # production build
npm run generate  # static generation
npm run preview   # preview the production build
```

## Spec-Driven Development

This project keeps feature specs in `specs/` and reusable templates in
`.specify/templates/`.

For meaningful product changes:

1. Create `specs/NNN-short-name/`.
2. Copy `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` from the templates.
3. Complete the spec and acceptance criteria before editing application code.
4. Use the plan to document impacted files, API contracts, tenant behavior, and
   verification steps.
5. Track implementation through `tasks.md`.

The project constitution lives in `.specify/memory/constitution.md`.

## Conventions

- Use `<script setup lang="ts">` in Vue components.
- Pages compose screens; repositories handle transport; composables own UI state and interaction rules.
- Keep `NUXT_API_KEY` in private runtime config.
- Add Laravel contracts to `app/types/api.ts` and UI models to `app/types/crm.ts`.
- Preserve both light and dark themes when changing components.
- Keep user-visible messages in Portuguese unless product requirements change.
