---
name: setup-tailwind-theme
description: 'Set up Tailwind CSS in Nuxt and implement a clean light/dark theme foundation for CRM UI pages. Use when starting UI styling or fixing theme consistency.'
argument-hint: 'Optional: include desired palette direction or CRM brand style'
user-invocable: true
---
# Setup Tailwind Theme

## When To Use
- Starting frontend implementation for CRM pages.
- Enabling light/dark theme support.
- Standardizing utility classes before building kanban components.

## Procedure
1. Install and configure Tailwind CSS for Nuxt.
2. Wire global styling entry points as required by Nuxt/Tailwind setup.
3. Define base design tokens (color roles, spacing rhythm, radii, shadows).
4. Implement explicit light/dark theme switching behavior.
5. Apply the foundation to `/login` and `/` pages.
6. Run app validation with `npm run dev`.

## Guardrails
- Keep theme foundations simple and maintainable.
- Ensure both themes remain readable and consistent.
- Avoid introducing API dependencies.
- Prefer reusable classes/patterns over one-off styling.

## Output Requirements
- List of created/updated files.
- Tailwind integration summary.
- Theme strategy summary (light/dark behavior).
- Validation result from local run.

## References
- Project constraints: [AGENTS.md](../../../AGENTS.md)
- Core setup notes: [README.md](../../../README.md)
