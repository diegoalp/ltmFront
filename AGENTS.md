# AGENTS

## Purpose
This repository is a Nuxt 4 frontend project for a CRM MVP with kanban workflow.
Current phase: UI integrated with the Laravel API.

## Product Scope (Current Iteration)
- Build only frontend pages and interactions.
- Use `useApi` for frontend requests. Each Laravel resource has an explicit route under `server/api`.
- Keep shared proxy behavior in `server/utils/laravel.ts`; resource route files should only declare routing or resource-specific behavior.
- Keep the Laravel API key server-side through `NUXT_API_KEY`.
- Deliver these pages first:
  - `/login`
  - `/` (CRM home with kanban board)

## Existing Project Context
- Nuxt starter state is still active (`NuxtWelcome` in `app/app.vue`).
- Main docs: [README](README.md).
- No lint/test setup yet.

## Commands
- Install deps: `npm install`
- Dev server: `npm run dev`
- Production build: `npm run build`
- Static generate: `npm run generate`
- Preview build: `npm run preview`

## Required Technical Direction
- Framework: Nuxt 4 + Vue 3 + TypeScript.
- Styling: Tailwind CSS with light and dark themes.
- Data source: Laravel API through `useApi`; domain composables own mapping and UI state.
- Keep Laravel response types in `app/types/api.ts` and UI/domain types in `app/types/crm.ts`.
- Architecture style: clean and modular; components should be small and reusable.

## Proposed Initial Structure
Use this as the default structure when implementing CRM screens:

- `app/pages/login.vue`
- `app/pages/index.vue` (CRM home)
- `app/components/auth/LoginForm.vue`
- `app/components/kanban/KanbanBoard.vue`
- `app/components/kanban/KanbanColumn.vue`
- `app/components/kanban/KanbanCard.vue`
- `app/components/layout/AppHeader.vue`
- `app/components/layout/AppSidebar.vue`
- `app/composables/useAuth.ts`
- `app/composables/useKanbanData.ts`
- `app/composables/useTheme.ts`
- `app/types/crm.ts`

## Agent Implementation Rules
- Replace placeholder starter UI (`NuxtWelcome` and default home text) before adding CRM pages.
- Keep business mock data outside page components.
- Use `script setup` with `lang="ts"` in Vue SFCs.
- Prefer computed values and composables over duplicated state in multiple components.
- Keep visual consistency between light and dark themes.
- Do not expose `NUXT_API_KEY` through public runtime config or browser-side code.

## Tailwind and Theming Notes
- If Tailwind is not configured yet, configure it before building screens.
- Theme behavior should be explicit and testable in dev:
  - light mode
  - dark mode
- Favor token-like class patterns for colors/spacings to keep UI maintainable.

## Definition of Done for This Phase
- `/login` page implemented and navigable.
- `/` page implemented as CRM kanban home.
- Kanban columns/cards rendered from the Laravel API.
- Light and dark themes both working.
- App runs with `npm run dev` without runtime errors.

## Out of Scope (Now)
- External auth providers.
- Full test/lint pipeline setup.
