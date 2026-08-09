import { PermissionType } from '@js-core/domain/models'

export interface CreatePermissionDTO {
  path: string
  title: string
  type: PermissionType
  icon?: string | null
  order?: number
  active?: boolean
  parentId?: string | null
}