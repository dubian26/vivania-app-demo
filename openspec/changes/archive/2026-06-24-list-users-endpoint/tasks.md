## 1. Application Layer

- [x] 1.1 Create `src/application/user/search-users.dto.ts` with `SearchUsersDTO` interface
- [x] 1.2 Create `src/application/user/search-users.validator.ts` with abstract validator class
- [x] 1.3 Create `src/application/user/search-users.query.ts` with `SearchUsersQuery` use case

## 2. Infrastructure Layer - Validators

- [x] 2.1 Create `src/infrastructure/validators/user/zod-search-users.validator.ts` with Zod schema and validator

## 3. Infrastructure Layer - Controller & Module

- [x] 3.1 Create `src/infrastructure/api/user/user.controller.ts` with `UserController` and `GET /users` endpoint
- [x] 3.2 Register `UserController`, `SearchUsersQuery`, and validator binding in `UserModule`

## 4. Verify

- [x] 4.1 Run `pnpm lint` to check for code issues
- [x] 4.2 Run `pnpm build` to verify compilation
