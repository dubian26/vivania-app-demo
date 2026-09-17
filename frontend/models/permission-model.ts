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

// Permission with its descendants nested, built from the flat list
// using parentId (see buildPermissionTree).
export interface PermissionTreeModel extends PermissionModel {
  children: PermissionTreeModel[]
}
