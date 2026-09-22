// Role returned by the backend (RoleResult).
export interface RoleModel {
  id: string
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
}

export interface RoleCreateModel {
  name: string
  description?: string
}

export interface RoleUpdateModel {
  id: string
  name?: string
  description?: string
}
