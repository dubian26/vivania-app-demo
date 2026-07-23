## ADDED Requirements

### Requirement: Admin update user active status and role
The system SHALL provide a `PATCH /users/:id` endpoint that allows an administrator to update a user's `active` and `roleId` fields.

#### Scenario: Admin updates user active status
- **WHEN** an authenticated administrator sends `PATCH /users/550e8400-e29b-41d4-a716-446655440000` with body `{"active": false}` and a valid JWT with roleName "Administrador"
- **THEN** the system SHALL return a 200 response with `{"id": "550e8400-...", "message": "Usuario actualizado."}`

#### Scenario: Admin updates user role
- **WHEN** an authenticated administrator sends `PATCH /users/550e8400-e29b-41d4-a716-446655440000` with body `{"roleId": "new-role-uuid"}` and a valid JWT with roleName "Administrador"
- **THEN** the system SHALL update the user's role and return a 200 response

#### Scenario: Admin updates both fields
- **WHEN** an authenticated administrator sends `PATCH /users/550e8400-e29b-41d4-a716-446655440000` with body `{"active": true, "roleId": "new-role-uuid"}`
- **THEN** the system SHALL update both fields

#### Scenario: Non-admin user tries to update
- **WHEN** a non-admin authenticated user sends `PATCH /users/550e8400-e29b-41d4-a716-446655440000`
- **THEN** the system SHALL return a validation error with message "No autorizado. Se requieren permisos de administrador."

#### Scenario: User not found
- **WHEN** an administrator sends `PATCH /users/non-existent-uuid` with a valid admin JWT
- **AND** no user exists with that UUID
- **THEN** the system SHALL return a validation error with message "El usuario no existe en la base de datos."

#### Scenario: Role not found
- **WHEN** an administrator sends `PATCH /users/550e8400-e29b-41d4-a716-446655440000` with body `{"roleId": "non-existent-role-uuid"}`
- **AND** no role exists with that UUID
- **THEN** the system SHALL return a validation error

#### Scenario: No fields provided
- **WHEN** an administrator sends `PATCH /users/550e8400-e29b-41d4-a716-446655440000` with body `{}`
- **THEN** the system SHALL return a validation error indicating at least one field is required

#### Scenario: Invalid UUID format in path
- **WHEN** an administrator sends `PATCH /users/not-a-uuid`
- **THEN** the system SHALL return a validation error

#### Scenario: Unauthenticated request
- **WHEN** a client sends `PATCH /users/550e8400-e29b-41d4-a716-446655440000` without a valid JWT
- **THEN** the system SHALL return a 401 Unauthorized error
