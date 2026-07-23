## Why

The system currently supports user creation, retrieval, and listing but lacks any mutation endpoints. Users cannot update their profile (name, password) and admins cannot manage user state (activate/deactivate, change roles). This blocks basic account management workflows.

## What Changes

- **New endpoint** `PATCH /users/:id` — Admin-only endpoint to update `active` and `roleId` fields on any user
- **New endpoint** `PATCH /auth/profile` — Authenticated user endpoint to update own `firstName`, `lastName`, and `password`
- **New domain errors**: `UserError.NotAuthorized()` for non-admin access attempts
- **New mutation methods on User entity**: `changePassword()`, `setActive()`, `setRole()`
- Email field is NOT updatable through any endpoint

## Capabilities

### New Capabilities
- `admin-update-user`: Admin can update user active status and role assignment
- `update-profile`: Authenticated user can update their own profile fields

### Modified Capabilities

<!-- No existing spec-level behavior changes -->

## Impact

- `backend/src/domain/user/user.ts` — new mutation methods
- `backend/src/domain/user/user-error.ts` — new error factory
- `backend/src/application/user/` — 2 new DTOs, 2 new validators, 2 new commands
- `backend/src/infrastructure/validators/user/` — 2 new Zod validators
- `backend/src/infrastructure/api/user/auth.controller.ts` — new `PATCH profile` method
- `backend/src/infrastructure/api/user/user.controller.ts` — new `PATCH :id` method
- `backend/src/infrastructure/api/user/user.module.ts` — register new providers
