## ADDED Requirements

### Requirement: Find user by ID
The system SHALL provide a `GET /users/:id` endpoint that returns a single user identified by UUID.

#### Scenario: Successful lookup by ID
- **WHEN** a client requests `GET /users/550e8400-e29b-41d4-a716-446655440000` with a valid JWT
- **THEN** the system SHALL return a 200 response with the user object containing id, email, firstName, lastName, roleId, active, emailVerified, createdAt, updatedAt, and roleName

#### Scenario: User not found
- **WHEN** a client requests `GET /users/550e8400-e29b-41d4-a716-446655440000` with a valid JWT
- **AND** no user exists with that UUID
- **THEN** the system SHALL return a validation error with message "El usuario no existe en la base de datos."

#### Scenario: Invalid UUID format
- **WHEN** a client requests `GET /users/not-a-uuid` with a valid JWT
- **THEN** the system SHALL return a validation error

#### Scenario: Unauthenticated request
- **WHEN** a client requests `GET /users/550e8400-e29b-41d4-a716-446655440000` without a valid JWT
- **THEN** the system SHALL return a 401 Unauthorized error

### Requirement: Find user by email
The system SHALL provide a `GET /users/by-email` endpoint that returns a single user identified by email address.

#### Scenario: Successful lookup by email
- **WHEN** a client requests `GET /users/by-email?email=user@example.com` with a valid JWT
- **THEN** the system SHALL return a 200 response with the user object containing id, email, firstName, lastName, roleId, active, emailVerified, createdAt, updatedAt, and roleName

#### Scenario: User not found by email
- **WHEN** a client requests `GET /users/by-email?email=unknown@example.com` with a valid JWT
- **AND** no user exists with that email
- **THEN** the system SHALL return a validation error with message "El usuario no existe en la base de datos."

#### Scenario: Invalid email format
- **WHEN** a client requests `GET /users/by-email?email=not-an-email` with a valid JWT
- **THEN** the system SHALL return a validation error

#### Scenario: Missing email parameter
- **WHEN** a client requests `GET /users/by-email` with a valid JWT
- **AND** no `email` query parameter is provided
- **THEN** the system SHALL return a validation error

#### Scenario: Unauthenticated request by email
- **WHEN** a client requests `GET /users/by-email?email=user@example.com` without a valid JWT
- **THEN** the system SHALL return a 401 Unauthorized error
