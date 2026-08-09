import { PermissionType } from '@js-core/domain/models'

export interface UpdatePermissionDTO {
  id: string
  path: string
  title: string
  type: PermissionType
  icon?: string | null
  order?: number
  active?: boolean
  parentId?: string | null
}