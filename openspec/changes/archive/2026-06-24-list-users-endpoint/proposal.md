## Why

The application lacks any endpoint to retrieve registered users. Admins and developers need a way to browse, search, and paginate through users for management and operational visibility.

## What Changes

- New `GET /users` endpoint with paginated search (skip, take, optional search query)
- New use case `SearchUsersQuery` in the application layer
- New DTO, validator, and Zod validator for search params
- New `UserController` in the infrastructure layer
- Registration of new controller and providers in `UserModule`

## Capabilities

### New Capabilities
- `list-users`: Paginated search listing of application users with optional text search across name and email fields

### Modified Capabilities

<!-- No existing capabilities are modified -->

## Impact

- **Backend**: 5 new files, 1 modified file (`UserModule`)
- **API contract**: `GET /users?skip=0&take=10&search=...` returns array of `UserResult` objects
- **Auth**: Protected by global JWT guard (authenticated users only, no role restriction yet)
