import { PermissionType } from '@js-core/domain/models'

export interface PermissionCreate {
  id: string
  path: string
  title: string
  type: PermissionType
  icon: string | null
  order: number
  active: boolean
  parentId: string | null
}

export interface PermissionProps extends PermissionCreate {
  createdAt: Date
  updatedAt: Date
}

export class Permission {
  private constructor(private props: PermissionProps) { }

  get id() { return this.props.id }
  get path() { return this.props.path }
  get title() { return this.props.title }
  get type() { return this.props.type }
  get icon() { return this.props.icon }
  get order() { return this.props.order }
  get active() { return this.props.active }
  get parentId() { return this.props.parentId }
  get createdAt() { return this.props.createdAt }
  get updatedAt() { return this.props.updatedAt }

  static create(data: PermissionCreate): Permission {
    return new Permission({
      id: data.id,
      path: data.path,
      title: data.title,
      type: data.type,
      icon: data.icon,
      order: data.order,
      active: data.active,
      parentId: data.parentId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  static fromDB(data: PermissionProps): Permission {
    return new Permission(data)
  }

  toDB(): PermissionProps {
    return this.props
  }

  toResult() {
    return {
      id: this.props.id,
      path: this.props.path,
      title: this.props.title,
      type: this.props.type,
      icon: this.props.icon,
      order: this.props.order,
      active: this.props.active,
      parentId: this.props.parentId,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    }
  }
}