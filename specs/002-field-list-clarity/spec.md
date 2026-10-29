# Feature Spec: Clearer field listing

**Created**: 2026-10-28  
**Status**: Accepted

## User Scenarios

Users scan field names, registration scope, type and whether display conditions
exist without reading long rule expressions in each row. Clicking Ver condições
opens a read-only dialog with the full rules and resolved option names.

## Functional Requirements

- **FR-001**: Combine registration scope and section in one column, and show
  required/optional status under the type. Keep the business value note discreet.
- **FR-002**: Replace inline rules with a compact conditions button or Sempre.
- **FR-003**: Show every condition, operator, and option in a scrollable dialog;
  explain that all conditions must match, with any listed value matching within
  a condition. Support keyboard focus, Escape, close button and backdrop dismissal.
- **FR-004**: Preserve filtering, reordering and field edit/delete behavior in
  both themes. Avoid horizontal overflow outside the table container.

## Acceptance Criteria

- [ ] The list has five columns with no inline rule expressions.
- [ ] Full conditions are available by clicking the row's detail button.
- [ ] Dialog dismissal returns focus and does not edit stored field data.
- [ ] Existing business value note, Portuguese type labels and actions remain.

## Data And API Contracts

No endpoint, payload or type changes. All tenant data continues through useApi
and server/api with the existing server-side instance context.

## Out Of Scope

Changes to condition logic, field persistence or the field editing form.

## Verification

Production build and browser verification of condensed rows and condition dialog.

Verification results: npm run build and git diff --check passed. Source review
confirmed five columns, no inline rule expressions, and complete rule details.
Interactive verification is pending: Firefox automation timed out twice, and
the separate preview browser redirected to login without an authenticated session.
