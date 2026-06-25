## Why

The system currently allows listing/searching users with pagination but lacks dedicated endpoints to retrieve a single user by ID or by email. These lookups are needed for profile views, admin panels, and cross-referencing in other features. The repository already implements `findById` and `findByEmail` — only the API layer is missing.

## What Changes

- Add `GET /users/:id` endpoint that returns a single user by UUID
- Add `GET /users/by-email` endpoint that returns a single user by email (query param `?email=xxx`)
- Both endpoints are private (JWT required)
- Both endpoints return the full `UserResult` shape (same as search)

## Capabilities

### New Capabilities
- `get-user`: Retrieve a single user by ID or email

### Modified Capabilities
- `list-users`: No requirement changes (search behavior unchanged)

## Impact

- `backend/src/infrastructure/api/user/user.controller.ts` — two new route handlers
- `backend/src/infrastructure/api/user/user.module.ts` — register new use cases and validator
- `backend/src/application/user/` — new files: `get-user.query.ts`, `get-user-by-email.query.ts`, `get-user-by-email.dto.ts`, `get-user-by-email.validator.ts`
- `backend/src/infrastructure/validators/user/` — new file: `zod-get-user-by-email.validator.ts`
