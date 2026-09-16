export type PermissionType = "MENU" | "ACTION"

// Permission returned by the backend (GET /permissions/role/:roleId).
export interface PermissionModel {
  id: string
  path: string
  title: string
  type: PermissionType
  icon: string | null
  order: number
  active: boolean
  parentId: string | null
  createdAt: string
  updatedAt: string
}
