## Context

The backend currently has user management only through auth flows (login, register, verify email). There is no endpoint to list or search users. The `UserRepository` already provides `listAll()` and `search()` methods, and `PrismaUserRepository` has a working implementation with role includes. The existing `RoleController` + `SearchRolesQuery` pattern serves as a direct template.

## Goals / Non-Goals

**Goals:**
- Provide a single paginated `GET /users` endpoint with optional text search
- Follow the existing clean architecture patterns (application use case → domain repository → infrastructure)
- Return users with role names included

**Non-Goals:**
- No user creation, update, or deletion in this change
- No role-based access control (admin restriction deferred)
- No total count in response (follows existing pattern of returning array directly)

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Single endpoint vs two | Single `GET /users` with pagination params | Simpler API surface; matches user request for search only (no separate "list all" endpoint) |
| Controller placement | New `UserController` (separate from `AuthController`) | Separation of concerns: auth vs user management, mirrors `RoleController` pattern |
| Validator pattern | Abstract + Zod implementation | Follows existing architecture: abstract in application layer, concrete Zod in infrastructure |
| Response shape | Plain array of `UserResult` | Matches existing pattern in `ListRolesQuery` / `SearchRolesQuery`; no wrapper object |
| Search fields | firstName, lastName, email (case-insensitive contains) | Already implemented in `PrismaUserRepository.search()` |
| Route path | `users` (plural, lowercase) | Consistent with `roles` endpoint |

## Risks / Trade-offs

- **No pagination metadata** → Client cannot know total pages. Mitigation: acceptable for MVP; can add `X-Total-Count` header or response wrapper later without breaking change.
- **No sorting params** → Results always ordered by `createdAt desc`. Mitigation: matches existing pattern; can be extended later.
