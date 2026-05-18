
export interface RoleCreate {
  id: string
  name: string
  description: string | null
}

export interface RoleDB {
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
  private constructor() { }

  private id: string = ''
  private name: string = ''
  private description: string | null = null
  private createdAt: Date = new Date()
  private updatedAt: Date = new Date()

  static create(data: RoleCreate): Role {
    const newRole = new Role()
    newRole.id = data.id
    newRole.name = data.name
    newRole.description = data.description
    return newRole
  }

  static fromDB(data: RoleDB) {
    const newRole = new Role()
    newRole.id = data.id
    newRole.name = data.name
    newRole.description = data.description
    newRole.createdAt = data.createdAt
    newRole.updatedAt = data.updatedAt
    return newRole
  }

  toDB(): RoleDB {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }

  toResult(): RoleResult {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }

  // Constantes y Evaluadores
  public static readonly ADMIN = 'Administrador'
  public static readonly CLIENTE = 'Cliente'

  private touch() {
    this.updatedAt = new Date()
  }

  rename(name: string, description: string) {
    this.name = name
    this.description = description
    this.touch()
  }
}
