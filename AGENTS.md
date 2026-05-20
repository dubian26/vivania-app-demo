# AGENTS.md

## Repo Shape
- Root is not a single workspace package. Work inside `backend/` and `frontend/` separately.
- Both apps use `pnpm`, but each keeps its own lockfile and dependency graph.

## Backend
- Stack: NestJS 11 on Fastify, Prisma 7, PostgreSQL.
- Entry point is `backend/src/main.ts`; root module is `backend/src/infrastructure/api/app.module.ts`.
- Folder roles are real clean-architecture boundaries:
  - `src/application`: use cases, DTOs, validator abstractions
  - `src/domain`: entities, repository contracts, domain errors
  - `src/infrastructure`: Nest controllers/modules, Prisma repositories, zod validator implementations
  - `src/shared`: cross-cutting helpers, guards, filters, models
- Wiring is infrastructure-first: controllers live under `src/infrastructure/api/**`, and concrete repository/provider bindings happen in `repo.module.ts` and `util.module.ts`.

## Backend Commands
- Install: `pnpm install` in `backend/`
- Dev server: `pnpm start:dev`
- Build: `pnpm build`
- Lint: `pnpm lint`
- Unit tests: `pnpm test`
- E2E tests: `pnpm test:e2e`

## Backend Gotchas
- `pnpm lint` runs ESLint with `--fix`, so it mutates files.
- App startup fails fast if `DATABASE_URL` is missing; Prisma is initialized in `PrismaDbContext`.
- `backend/docker-compose.local.yml` starts only Postgres. `backend/docker-compose.yml` starts Postgres plus the app container.
- Production container runs `npx prisma migrate deploy && npm start`, so migrations are part of container startup.
- Prisma migrations seed required data:
  - roles: `Administrador`, `Cliente`
  - admin user: `root@admin.com`
- Registration depends on the seeded `Cliente` role existing; `RegisterUserCommand` looks it up by name.
- Auth is global by default through `APP_GUARD`; routes are private unless marked with `@Public()`.
- Current public endpoints are `POST /auth/login` and `POST /auth/register`.
- JWT auth accepts either `Authorization: Bearer ...` or the `accessToken` cookie.
- Global errors are shaped by `GlobalExceptionFilter`; preserve that response contract when adding failures.

## Backend Env
- Token expiry vars are `EXPIRE_ACCESS_TOKEN` and `EXPIRE_REFRESH_TOKEN`.
- Code defaults to `15m` and `2d` if those vars are absent.
- `PORT` defaults to `3000` in code; `docker-compose.yml` maps the containerized app to `3001`.

## Backend Tests
- Unit tests use Jest with `rootDir: src`; place specs under `backend/src/**/*.spec.ts`.
- E2E config is `backend/test/jest-e2e.json`.
- Existing e2e tests import the real `AppModule` and only override `PasswordHasher`; DB-backed providers are still real, so e2e runs can require a reachable Postgres unless you override more providers.

## Frontend
- Frontend is a Vite React 19 app and is still mostly scaffold-level.
- Entry point is `frontend/src/main.tsx`; current app component is `frontend/src/App.tsx`.
- Commands in `frontend/`:
  - install: `pnpm install`
  - dev server: `pnpm dev`
  - build: `pnpm build`
  - lint: `pnpm lint`

## Style / Tooling
- Both apps enforce single quotes in ESLint.
- Backend `.editorconfig` enforces 2 spaces, LF, and final newline.
