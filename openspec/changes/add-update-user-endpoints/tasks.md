## 1. Domain layer — User entity & errors

- [x] 1.1 Add `changePassword(hashedPassword)` method to `User` entity
- [x] 1.2 Add `setActive(active)` method to `User` entity
- [x] 1.3 Add `setRole(roleId)` method to `User` entity
- [x] 1.4 Add `NotAuthorized()` static factory to `UserError`

## 2. Application layer — UpdateUserCommand (admin)

- [x] 2.1 Create `UpdateUserDTO` interface with optional `active` and `roleId`
- [x] 2.2 Create `UpdateUserValidator` abstract class
- [x] 2.3 Create `UpdateUserCommand` with admin role check, user lookup, role validation, and update logic

## 3. Application layer — UpdateProfileCommand (self)

- [x] 3.1 Create `UpdateProfileDTO` interface with optional `firstName`, `lastName`, `password`
- [x] 3.2 Create `UpdateProfileValidator` abstract class
- [x] 3.3 Create `UpdateProfileCommand` that reads user from JWT, hashes password if provided, and updates

## 4. Infrastructure — Zod validators

- [x] 4.1 Create `ZodUpdateUserValidator` extending `UpdateUserValidator`
- [x] 4.2 Create `ZodUpdateProfileValidator` extending `UpdateProfileValidator`

## 5. Controllers — HTTP endpoints

- [x] 5.1 Add `@Patch(':id')` method to `UserController` using `UpdateUserCommand`
- [x] 5.2 Add `@Patch('profile')` method to `AuthController` using `UpdateProfileCommand` and `@Req()` for current user

## 6. Module wiring — UserModule

- [x] 6.1 Register `UpdateUserCommand`, `UpdateProfileCommand`, and their Zod validators in `UserModule`
