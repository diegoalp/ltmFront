# Implementation Plan: Persist the business value field

**Date**: 2026-10-28

Add a boolean column with false default in the sibling ltmApi project, validate
currency-only activation, and expose the flag through normal model serialization.
Add regression tests covering creation, update, reload, clearing, and isolation.
Remove speculative duplicate camelCase write attributes from the frontend and
check the API value after saving. Keep the existing checkbox and badge.

Tenant context continues through useApi and server/utils/laravel.ts; backend
InstanceCrudController scopes all resource operations to the selected instance.

Run backend spec checks and tests, then npm run build. Apply only the new additive
migration to the configured local database, inspecting pending state first.
Changes in ltmApi require filesystem approval because it is outside writable roots.
