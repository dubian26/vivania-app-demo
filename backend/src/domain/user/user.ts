import { UserInfo } from '@/shared/models/user-info'

export interface UserCreate {
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  roleId: string
}

export interface UserDB {
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  roleId: string
  active: boolean
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
  roleName?: string
}

export interface UserResult {
  id: string
  email: string
  firstName: string
  lastName: string
  roleId: string
  active: boolean
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
  roleName?: string
}

export class User {
  private constructor() {}

  public id: string = ''
  public email: string = ''
  public password: string = ''
  public firstName: string = ''
  public lastName: string = ''
  public roleId: string = ''
  public active: boolean = false
  public emailVerified: boolean = false
  public createdAt: Date = new Date()
  public updatedAt: Date = new Date()
  public roleName?: string

  static create(data: UserCreate): User {
    const newUser = new User()
    newUser.id = data.id
    newUser.email = data.email
    newUser.password = data.password
    newUser.firstName = data.firstName
    newUser.lastName = data.lastName
    newUser.roleId = data.roleId
    return newUser
  }

  static fromDB(data: UserDB) {
    const newUser = new User()
    newUser.id = data.id
    newUser.email = data.email
    newUser.password = data.password
    newUser.firstName = data.firstName
    newUser.lastName = data.lastName
    newUser.roleId = data.roleId
    newUser.active = data.active
    newUser.emailVerified = data.emailVerified
    newUser.createdAt = data.createdAt
    newUser.updatedAt = data.updatedAt
    newUser.roleName = data.roleName
    return newUser
  }

  toDB(): UserDB {
    return {
      id: this.id,
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      roleId: this.roleId,
      active: this.active,
      emailVerified: this.emailVerified,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      roleName: this.roleName,
    }
  }

  toResult(): UserResult {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      roleId: this.roleId,
      active: this.active,
      emailVerified: this.emailVerified,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      roleName: this.roleName,
    }
  }

  toUserInfo(): UserInfo {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      roleId: this.roleId,
      roleName: this.roleName,
    }
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }

  private touch() {
    this.updatedAt = new Date()
  }

  rename(firstName: string, lastName: string) {
    this.firstName = firstName
    this.lastName = lastName
    this.touch()
  }

  activate() {
    this.active = true
    this.touch()
  }

  verifyEmail() {
    this.emailVerified = true
    this.touch()
  }
}
