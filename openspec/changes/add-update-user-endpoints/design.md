## Context

The backend uses clean architecture with NestJS/Fastify, Prisma/PostgreSQL, and a global JWT guard. Existing users endpoints (`GET /users`, `GET /users/:id`, `GET /users/by-email`) are read-only. The `User` entity already has mutation methods (`rename`, `activate`, `verifyEmail`) that call `touch()` to update `updatedAt`. The `UserRepository.update()` method already works generically by calling `toDB()` and passing the result to Prisma's `update`.

## Goals / Non-Goals

**Goals:**
- Admin endpoint `PATCH /users/:id` to modify `active` and `roleId` of any user
- Profile endpoint `PATCH /auth/profile` to modify `firstName`, `lastName`, `password` of the authenticated user
- Proper authorization: admin-only for `PATCH /users/:id`, JWT-protected for `PATCH /auth/profile`
- New domain mutation methods on the `User` entity

**Non-Goals:**
- Email updates (explicitly excluded)
- Password reset flow (separate concern)
- Role management CRUD (roles are seeded)
- User deletion

## Decisions

### Decision 1: Separate commands for admin vs profile updates
- **Choice**: Two distinct commands — `UpdateUserCommand` (admin) and `UpdateProfileCommand` (profile)
- **Rationale**: Different authorization rules, different fields, different dependencies. Admin command needs `RoleRepository` to validate `roleId`; profile command needs `PasswordHasher` to hash new passwords. Mixing them would create a single command with conditional logic and optional dependencies.
- **Alternative considered**: Single `UpdateUserCommand` with role check inside — rejected because it couples admin and user concerns.

### Decision 2: Check admin role by `roleName` from JWT payload
- **Choice**: Read `request.user.roleName` (already set by `JwtAuthGuard`) and compare to `'Administrador'`
- **Rationale**: The JWT already includes `roleName`. No extra DB query needed for authorization. The role name `'Administrador'` is the seeded value from migrations.
- **Alternative considered**: Query `RoleRepository` to resolve role by `roleId` — unnecessary DB round-trip.

### Decision 3: New mutation methods on User entity
- **Choice**: Add `changePassword(hashedPassword)`, `setActive(active)`, `setRole(roleId)` to `User` class
- **Rationale**: Follows existing pattern (`rename`, `activate`, `verifyEmail`). Keeps domain explicit. Each method calls `touch()`.
- **Alternative considered**: Generic `update(props)` method — less explicit, obscures which fields can change.

### Decision 4: `PATCH` semantics — partial update, at least one field required
- **Choice**: All DTO fields are optional, but validator enforces at least one field present
- **Rationale**: `PATCH` implies partial update. Requiring at least one field prevents no-op requests.
- **Alternative considered**: `PUT` with all required fields — too rigid for profile updates where user may only want to change password.

### Decision 5: Password hashing inside `UpdateProfileCommand`
- **Choice**: `UpdateProfileCommand` injects `PasswordHasher` and hashes the password before setting it on the entity
- **Rationale**: Domain entity should not know about hashing. Hashing is an infrastructure concern, triggered by the application layer.

## Risks / Trade-offs

- **Risk**: Admin could set `roleId` to a non-existent role → Mitigation: `UpdateUserCommand` queries `RoleRepository.findById()` and throws `RoleError.NotExists()`
- **Risk**: Token could be stolen and used to call `PATCH /auth/profile` to change password → Mitigation: already handled by existing JWT guard; future improvement could add re-authentication for sensitive changes
- **Trade-off**: Checking `roleName` from JWT means role changes don't take effect until token refresh → Acceptable for now; admin changing their own role is an edge case
