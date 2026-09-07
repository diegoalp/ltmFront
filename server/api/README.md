# Nuxt server routes

This directory is the boundary between the browser and Laravel. Each directory explicitly represents a resource exposed to the frontend.

```text
useApi('/products/10')
  → server/api/products/[...path].ts
  → proxyToLaravel(event)
  → ltmApi /api/products/10
```

Simple handlers delegate to `server/utils/laravel.ts`, which owns shared transport concerns: API key, token, instance context, query parameters, and request body.

Create a more specific route when an endpoint needs extra validation, transformation, or authorization in Nuxt. For example, `server/api/products/export.get.ts` takes priority over `[...path].ts`. Keep product rules out of the shared proxy utility.

Authentication and instance-management routes call `proxyToLaravel(event, { tenantAware: false })`, preventing the selected tenant from being attached to global operations. Other resources are tenant-aware by default.

Security rules:

- Never move `NUXT_API_KEY` into `runtimeConfig.public`.
- Never call `ltmApi` directly from components or composables.
- Let the shared utility obtain tokens and instance IDs from the server session cookies.

## CRM history and scheduling contract

The business detail screen expects these tenant-aware Laravel resources. Collection
responses may be arrays or Laravel paginated resources; single resources may be
returned directly or inside `data`.

- `GET/POST /api/notes`, `DELETE /api/notes/{id}`. Filter by `business_id`.
  A note contains `id`, `body`, `business_id`, `created_at`, and optional `user`.
- `GET/POST /api/activities`, `PATCH/DELETE /api/activities/{id}`. Filter by
  `business_id`. An activity contains `title`, `description`, `scheduled_at`,
  `status`, `activity_type_id`, optional `activity_type`, and optional `user`.
- `GET/POST /api/activity-types`, `DELETE /api/activity-types/{id}`. A type
  contains `id`, `activity_type`, `funnel_ids` (array of IDs), optional `color`, and optional `active`.
  Creation sends `activity_type` (up to 30 characters) and `funnel_ids` (no color). An empty array makes the type
  available in all funnels; otherwise it is restricted to the selected funnels.
  The optional GET filter `funnel_id` includes global types and types linked to that funnel.
- `GET/POST /api/document-types`, `DELETE /api/document-types/{id}`. A type
  contains `id`, `name`, and optional `active`.
- `POST /api/documents` additionally receives `document_type_id`; `title` is
  also sent for compatibility and is the selected document type name.

All records must be scoped and validated against the `instance_id` injected by
the proxy. The Laravel API should reject relationships belonging to another
instance and should prevent deletion of catalog items that are already in use
(or archive them by setting `active` to false).

## Activities calendar

- `POST /api/activities`: `business_id`, `activity_type_id`, `title`,
  `scheduled_at` (ISO 8601 with timezone), optional `description`.
  Optional `user_id` selects an allowed assignee (defaults to the authenticated user).
  The API sets `status: pending`.
- `GET /api/activities/assignees?business_id=...` returns the permitted assignees:
  seller: self/supervisor; supervisor: self/business owner;
  admin/master: self/business owner/business owner's supervisor.
  The same rules are validated on creation, excluding removed and cross-instance users.
- `GET /api/activities?start=...&end=...`: inclusive start, exclusive end.
  Optional `business_id` filters a business.
- `GET /api/activities/today?timezone=America/Sao_Paulo`: today's activities
  including completed items, using the requested local timezone.
- `GET /api/activities/{id}`, `PATCH /api/activities/{id}` with
  `status: completed`, and `DELETE /api/activities/{id}`.
- Admin/master see the selected instance. Sellers see their own activities and
  those of direct reports identified by `users.supervisor_id`.
- The navbar counts pending activities today. The login reminder is shown once
  per login and its session cookie is reset on a new login/logout.
