
export interface RoleCreate {
  id: string
  name: string
  description: string | null
}

export interface RoleProps {
  id: string
  name: string
  description: string | null
  createdAt: Date
  updatedAt: Date
}

export interface RoleResult {
  id: string
  name: string
  description: string | null
  createdAt: Date
  updatedAt: Date
}

export class Role {
  private constructor(private props: RoleProps) { }

  get id() { return this.props.id }
  get name() { return this.props.name }
  get description() { return this.props.description }
  get createdAt() { return this.props.createdAt }
  get updatedAt() { return this.props.updatedAt }

  // Constantes y Evaluadores
  public static readonly ADMIN = 'Administrador'
  public static readonly CLIENTE = 'Cliente'

  static create(data: RoleCreate): Role {
    return new Role({
      id: data.id,
      name: data.name,
      description: data.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  static fromDB(data: RoleProps) {
    return new Role(data)
  }

  toDB(): RoleProps {
    return this.props
  }

  toResult(): RoleResult {
    return {
      id: this.props.id,
      name: this.props.name,
      description: this.props.description,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    }
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  rename(name: string) {
    this.props.name = name
    this.touch()
  }
}
