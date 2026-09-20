# Project Constitution

## Core Principles

### Spec First

Every meaningful product change starts with a spec under `specs/`. The spec
describes the user problem, scenarios, functional requirements, acceptance
criteria, and impacted screens or API routes before implementation begins.

### Nuxt Boundary

Frontend code must communicate with Laravel only through `useApi` and explicit
Nuxt server routes in `server/api`. Keep authentication, API key handling, and
tenant context server-side.

### Domain Ownership

Pages compose screens, components render focused UI, composables own interaction
state, repositories own payload and transport details, and shared contracts live
in `app/types`.

### Tenant Safety

Any spec that reads or writes tenant-scoped data must name how `instance_id` is
provided, validated, or proxied. Browser-visible code must not expose private
runtime config or Laravel API keys.

### Verifiable Delivery

Each implementation plan must define verification steps. At minimum, run
`npm run build` for code changes unless the spec explains why a lighter check is
sufficient.

## Workflow

1. Create a feature folder in `specs/NNN-short-name`.
2. Write `spec.md` from the feature spec template.
3. Write `plan.md` once the technical shape is known.
4. Break the work into `tasks.md`.
5. Implement only what is covered by the active spec and update the spec when
   the product decision changes.

## Definition Of Ready

A spec is ready for implementation when it has:

- Clear user scenarios.
- Functional requirements with stable IDs.
- Acceptance criteria for the main flows and relevant edge cases.
- Data/API contract notes for changed Laravel-facing behavior.
- A verification plan.

## Definition Of Done

A change is done when:

- Implemented behavior matches the spec requirements.
- New or changed API routes preserve the Nuxt server boundary.
- User-visible copy is in Portuguese.
- Technical identifiers and documentation remain in English.
- Verification steps from `plan.md` were run or explicitly documented as not run.
