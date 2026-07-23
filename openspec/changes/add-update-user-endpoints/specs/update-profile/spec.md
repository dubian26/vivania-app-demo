## ADDED Requirements

### Requirement: Authenticated user updates own profile
The system SHALL provide a `PATCH /auth/profile` endpoint that allows an authenticated user to update their own `firstName`, `lastName`, and `password`.

#### Scenario: User updates first name and last name
- **WHEN** an authenticated user sends `PATCH /auth/profile` with body `{"firstName": "Nuevo", "lastName": "Apellido"}` and a valid JWT
- **THEN** the system SHALL return a 200 response with `{"id": "user-uuid", "message": "Perfil actualizado."}`

#### Scenario: User updates password
- **WHEN** an authenticated user sends `PATCH /auth/profile` with body `{"password": "NuevaContra1"}` and a valid JWT
- **THEN** the system SHALL hash the new password and update it, returning a 200 response

#### Scenario: User updates all fields
- **WHEN** an authenticated user sends `PATCH /auth/profile` with body `{"firstName": "Nuevo", "lastName": "Apellido", "password": "NuevaContra1"}`
- **THEN** the system SHALL update all three fields

#### Scenario: No fields provided
- **WHEN** an authenticated user sends `PATCH /auth/profile` with body `{}`
- **THEN** the system SHALL return a validation error indicating at least one field is required

#### Scenario: Invalid first name length
- **WHEN** an authenticated user sends `PATCH /auth/profile` with body `{"firstName": "A"}`
- **THEN** the system SHALL return a validation error indicating first name is too short

#### Scenario: Invalid password strength
- **WHEN** an authenticated user sends `PATCH /auth/profile` with body `{"password": "short"}`
- **THEN** the system SHALL return a validation error indicating password requirements

#### Scenario: Unauthenticated request
- **WHEN** a client sends `PATCH /auth/profile` without a valid JWT
- **THEN** the system SHALL return a 401 Unauthorized error
