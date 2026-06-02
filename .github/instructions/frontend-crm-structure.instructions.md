---
description: "Use when creating or editing Nuxt frontend files for CRM screens, kanban board, login flow, mock data composables, and light/dark theme behavior."
name: "Frontend CRM Structure"
applyTo: "app/**/*.vue, app/**/*.ts"
---
# Frontend CRM Structure

## Goal
Keep the CRM MVP clean, modular, and easy to evolve while working with fake data only.

## Scope (Current Phase)
- Implement UI-first pages and interactions.
- Do not call external APIs.
- Keep all CRM data mocked locally.

## Routing and Page Rules
- Create and maintain these routes first:
  - `/login`
  - `/` (kanban-style CRM home)
- Replace starter placeholders from Nuxt default templates when touched.

## Folder Conventions
- `app/pages/`: route-level pages only, minimal orchestration logic.
- `app/components/auth/`: authentication UI pieces.
- `app/components/kanban/`: board, columns, cards, and related UI.
- `app/components/layout/`: shell components (header/sidebar/topbar).
- `app/composables/`: reusable state and data access for mock auth/kanban/theme.
- `app/types/`: TypeScript interfaces and domain types.

## Data and State Rules
- Keep mock CRM entities in composables or local fixtures, not in page templates.
- Use TypeScript interfaces for deals, columns, users, and activity metadata.
- Prefer computed/derived state to avoid duplication.

## Styling and Theming Rules
- Use Tailwind classes and utility-driven layout.
- All new CRM UI must support light and dark mode.
- Keep color usage consistent through reusable token-like class choices.

## Vue/Nuxt Coding Rules
- Use `<script setup lang=\"ts\">` for Vue SFCs.
- Keep components focused and composable; avoid oversized page files.
- Use Nuxt auto-imports for composables/components where appropriate.

## Done Checklist
- `/login` and `/` render without runtime errors.
- Kanban board uses fake local data.
- Light and dark modes are both functional.
- App runs through `npm run dev` cleanly.

## References
- Project-level guardrails: [AGENTS.md](../../AGENTS.md)
- Nuxt setup and scripts: [README.md](../../README.md)
