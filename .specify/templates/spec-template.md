# Feature Spec: [FEATURE NAME]

**Feature Branch**: `[NNN-short-name]`  
**Created**: [YYYY-MM-DD]  
**Status**: Draft  
**Owner**: [Name or team]

## Summary

[One or two paragraphs describing the user problem, desired outcome, and why it
matters.]

## User Scenarios

### Scenario 1: [Primary flow]

**Given** [starting state]  
**When** [user action]  
**Then** [observable result]

### Scenario 2: [Secondary flow]

**Given** [starting state]  
**When** [user action]  
**Then** [observable result]

## Functional Requirements

- **FR-001**: [The system MUST...]
- **FR-002**: [The system MUST...]
- **FR-003**: [The system MUST...]

## Acceptance Criteria

- [ ] [Criterion mapped to one or more functional requirements.]
- [ ] [Criterion mapped to one or more functional requirements.]
- [ ] [Criterion mapped to one or more functional requirements.]

## Data And API Contracts

### Nuxt Routes

- `[METHOD] /api/[resource]`: [Purpose, query/body, tenant behavior.]

### Laravel Endpoints

- `[METHOD] /api/[resource]`: [Expected payload and response shape.]

### Types

- `app/types/api.ts`: [Raw API contract changes.]
- `app/types/crm.ts`: [UI/domain model changes.]

## UI Notes

- Screens impacted: [List pages/components.]
- States required: [Loading, empty, error, disabled, success.]
- User-visible copy: [Portuguese copy notes.]

## Edge Cases

- [Edge case and expected behavior.]
- [Edge case and expected behavior.]

## Out Of Scope

- [Explicitly excluded behavior.]

## Verification

- [ ] `npm run build`
- [ ] [Manual flow or automated check.]
