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
- Frontend is a Next.js 16 app (App Router, React 19, Tailwind CSS 4) with shadcn-style UI on `@base-ui/react`.
- App Router entry points: root layout `frontend/app/layout.tsx`; routes live under `frontend/app/**`.
- `/` redirects to `/login`; the login landing page is `frontend/app/login/page.tsx` with its layout in `frontend/app/login/layout.tsx`.
- Login is wired to the backend (`POST /auth/login`). The backend returns `UserInfo` in the body and sets httpOnly cookies (`accessToken`/`refreshToken`).
- Data layer mirrors the reference architecture in `projects/demo-tienda-online-full`:
  - `frontend/appconfig/`: `FetchUtility` (fetch wrapper), `CustomError`, `constants.ts`
  - `frontend/models/`: `ErrorModel`, `UserInfoModel` (contracts matching the backend)
  - `frontend/repositories/`: `UserRepository.authenticate(email, password)`
  - `frontend/contexts/`: `AppProvider`/`useAppContext` (session + alert toasts via `sonner`)
  - `frontend/hooks/`: `useAsync` (loading + automatic error toast)
- Alert context API: `useAppContext()` exposes `showError(error)` and `showMessage(msg)`; call these instead of `toast` directly.
- The backend has no CORS and uses `sameSite: strict` cookies, so the frontend proxies `/api/*` to the backend via `rewrites()` in `frontend/next.config.ts` (target from `BACKEND_URL` in `.env.local`). Client code calls same-origin `/api/...`.
- `pnpm dev` runs on port `3001` because the backend occupies `3000` locally.
- UI components live under `frontend/components/login`, `frontend/components/common` and `frontend/components/ui`.
- The theme uses a green palette defined in `frontend/app/globals.css` (light/dark via `next-themes`).
- Commands in `frontend/`:
  - install: `pnpm install`
  - dev server: `pnpm dev`
  - build: `pnpm build`
  - lint: `pnpm lint`
  - typecheck: `pnpm typecheck`

## Style / Tooling
- Backend ESLint enforces single quotes. Frontend Prettier uses double quotes (`singleQuote: false`) and no semicolons.
- Backend `.editorconfig` enforces 2 spaces, LF, and final newline.
