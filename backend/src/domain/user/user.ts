import { UserInfo } from '@/shared/models/user-info'

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
  constructor(
    public id: string,
    public email: string,
    public password: string,
    public firstName: string,
    public lastName: string,
    public roleId: string,
    public active: boolean,
    public emailVerified: boolean,
    public createdAt: Date,
    public updatedAt: Date,
    public roleName?: string,
  ) {}

  private touch() {
    this.updatedAt = new Date()
  }

  static fromDB(data: UserDB) {
    return new User(
      data.id,
      data.email,
      data.password,
      data.firstName,
      data.lastName,
      data.roleId,
      data.active,
      data.emailVerified,
      data.createdAt,
      data.updatedAt,
      data.roleName,
    )
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
