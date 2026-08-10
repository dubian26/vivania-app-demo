export type PermissionType = 'MENU' | 'ACTION'

export interface PermissionModel {
  id: string
  path: string
  title: string
  type: PermissionType
  icon: string | null
  order: number
  active: boolean
  parentId: string | null
  createdAt: Date
  updatedAt: Date
}
