## Context

The backend uses a clean architecture with NestJS, Prisma, and Zod. Controllers delegate to use cases/queries which call repository interfaces. The `UserRepository` already implements `findById` and `findByEmail`. A `UuidValidator` contract exists globally in `util.module.ts`. The existing `GetRoleQuery` in the role module serves as the reference pattern for the by-ID endpoint.

Two new endpoints are needed:
- `GET /users/:id` — find user by UUID
- `GET /users/by-email?email=xxx` — find user by email

## Goals / Non-Goals

**Goals:**
- Add `GET /users/:id` returning `UserResult` (same shape as search)
- Add `GET /users/by-email?email=xxx` returning `UserResult`
- Both endpoints require JWT authentication (global guard applies by default)
- Follow the exact patterns established by `GetRoleQuery` and `SearchUsersQuery`

**Non-Goals:**
- No changes to the user model, Prisma schema, or repository layer
- No changes to authentication or authorization logic
- No new database queries or migrations

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Reuse `UuidValidator` for by-ID | Yes | Already globally registered in `util.module.ts`; same pattern as `GetRoleQuery` |
| Create `GetUserByEmailValidator` | Yes | No existing email validator contract; follows the abstract/Zod validator pattern used by all other use cases |
| Response shape | `UserResult` (same as search) | Consistency; client already consumes this shape from `GET /users` |
| `UserError.NotExists()` for both 404 cases | Yes | Already exists with message "El usuario no existe en la base de datos." — no need for a separate error class |
| Route path for email lookup | `GET /users/by-email?email=xxx` | Query param avoids exposing email in URL path; consistent with REST conventions for filtered lookups |
| No new capabilities spec for modified | N/A | `list-users` capability behavior is unchanged |

## Risks / Trade-offs

- **Race condition on email**: The `findByEmail` lookup could return stale data in high-concurrency scenarios. Existing architecture already handles this via `TxManager` for writes; reads are intentionally outside transactions. Acceptable for a read-only endpoint.
- **Email case sensitivity**: `findByEmail` in Prisma is case-sensitive by default. If needed, this can be handled at app or DB level later. Out of scope for this change.
