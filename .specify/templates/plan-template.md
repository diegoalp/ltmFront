# Implementation Plan: [FEATURE NAME]

**Spec**: `specs/[NNN-short-name]/spec.md`  
**Date**: [YYYY-MM-DD]

## Technical Context

- Framework: Nuxt 4, Vue 3, TypeScript
- Styling: Tailwind CSS
- API boundary: `useApi` → `server/api` → Laravel
- Tenant context: [How `instance_id` is provided or proxied.]

## Impacted Files

- `[path]`: [Expected change.]
- `[path]`: [Expected change.]

## Approach

[Describe the implementation strategy. Keep this focused on behavior and
architecture decisions, not line-by-line code.]

## Data Flow

```text
[page/component] -> [composable/repository] -> useApi -> server/api/[route] -> Laravel
```

## Risks And Mitigations

- **Risk**: [Risk.]
  **Mitigation**: [Mitigation.]

## Verification Plan

- [ ] `npm run build`
- [ ] [Manual browser flow.]
- [ ] [Additional check, if needed.]

## Open Questions

- [Question or "None".]
