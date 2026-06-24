## ADDED Requirements

### Requirement: List users with paginated search
The system SHALL provide a `GET /users` endpoint that returns a paginated list of users with optional text search.

#### Scenario: Successful search with results
- **WHEN** a client requests `GET /users?skip=0&take=10`
- **THEN** the system SHALL return an array of up to 10 user objects with id, email, firstName, lastName, roleId, active, emailVerified, createdAt, updatedAt, and roleName

#### Scenario: Search with text filter
- **WHEN** a client requests `GET /users?skip=0&take=10&search=juan`
- **THEN** the system SHALL return users whose firstName, lastName, or email contains "juan" (case-insensitive)

#### Scenario: Pagination with offset
- **WHEN** a client requests `GET /users?skip=10&take=5`
- **THEN** the system SHALL skip the first 10 users and return up to 5 users after that offset

#### Scenario: Invalid skip value
- **WHEN** a client requests `GET /users?skip=-1&take=10`
- **THEN** the system SHALL return a validation error

#### Scenario: Invalid take value
- **WHEN** a client requests `GET /users?skip=0&take=0`
- **THEN** the system SHALL return a validation error

#### Scenario: Unauthenticated request
- **WHEN** a client requests `GET /users?skip=0&take=10` without a valid JWT
- **THEN** the system SHALL return a 401 Unauthorized error
