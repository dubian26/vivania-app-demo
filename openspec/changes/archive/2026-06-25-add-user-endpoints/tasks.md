## 1. Application Layer — New Use Cases

- [x] 1.1 Create `src/application/user/get-user.query.ts` — `GetUserQuery` that validates UUID, calls `userRepository.findById()`, throws `UserError.NotExists()` if null, returns `user.toResult()`
- [x] 1.2 Create `src/application/user/get-user-by-email.dto.ts` — `GetUserByEmailDTO` interface with `email: string`
- [x] 1.3 Create `src/application/user/get-user-by-email.validator.ts` — abstract validator class `GetUserByEmailValidator` with `validate(input: GetUserByEmailDTO): void`
- [x] 1.4 Create `src/application/user/get-user-by-email.query.ts` — `GetUserByEmailQuery` that validates email, calls `userRepository.findByEmail()`, throws `UserError.NotExists()` if null, returns `user.toResult()`

## 2. Infrastructure Layer — Validator Implementation

- [x] 2.1 Create `src/infrastructure/validators/user/zod-get-user-by-email.validator.ts` — `ZodGetUserByEmailValidator` extending the abstract validator, using `z.object({ email: z.string().email(...) })`

## 3. API Layer — Controller and Module Wiring

- [x] 3.1 Add `findById(@Param('id') id)` and `findByEmail(@Query() query: GetUserByEmailDTO)` handlers to `UserController`
- [x] 3.2 Register `GetUserQuery`, `GetUserByEmailQuery`, `GetUserByEmailValidator` → `ZodGetUserByEmailValidator` in `UserModule`

## 4. Verification

- [x] 4.1 Run `pnpm lint` in `backend/` to verify no linting errors
- [x] 4.2 Run `pnpm build` in `backend/` to verify compilation
