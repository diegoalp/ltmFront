# Feature Spec: Persist the business value field

**Created**: 2026-10-28  
**Status**: Implemented

## Summary

The API currently discards the business value flag because its schema, model,
and validation do not support it. Both the edit checkbox and list badge depend
on this persisted flag.

## User Scenarios

Given a currency field, when its business value option is saved and the list is
reloaded, the badge is visible and editing the field shows a checked option.
When the option is disabled and reloaded, both indicators are disabled.

## Functional Requirements

- **FR-001**: Persist and return `is_business_value` as a boolean.
- **FR-002**: Allow true only for currency fields; clear it on type changes.
- **FR-003**: Verify the saved flag after reloading before reporting success.

## Acceptance Criteria

- [x] POST/PATCH and subsequent GET preserve true and false.
- [x] Unrelated PATCH operations preserve the flag.
- [x] Other tenants cannot read or modify the flag.
- [x] The existing checkbox and badge consume the persisted API value.

## Data And API Contracts

Nuxt POST/GET `/api/custom-fields` and PATCH/GET `/api/custom-fields/:id`
continue proxying Laravel with the server-side tenant context. Laravel adds
`is_business_value` to its schema, validation, fillable attributes and casts.
The canonical write payload uses snake_case. No authentication changes.

## Out Of Scope

Backfilling business amounts or inferring the previously discarded flag from a
field name. Previously discarded choices need to be saved once after migration.

## Verification

API regression tests using an isolated in-memory SQLite database; frontend build.

Results: all four CustomFieldBusinessValueTest cases passed (45 assertions).
The frontend production build passed. Saved Contrato in the existing Firefox
session, reloaded the page, observed its badge, reopened editing, and visually
confirmed the checked business value option. The additive migration was applied
to the configured local MySQL database; other pending migrations were untouched.
The full backend suite passed 89 of 93 tests. Four unrelated client search tests
call /api/clients/search while routes/api.php defines /api/clients/search/by-registration.
