import { UserInfo } from '@base/core/models'

export interface UserCreate {
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  roleId: string
}

export interface UserProps {
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
  private constructor(private props: UserProps) { }

  get id() { return this.props.id }
  get email() { return this.props.email }
  get password() { return this.props.password }
  get firstName() { return this.props.firstName }
  get lastName() { return this.props.lastName }
  get fullName() { return `${this.firstName} ${this.lastName}` }
  get roleId() { return this.props.roleId }
  get active() { return this.props.active }
  get emailVerified() { return this.props.emailVerified }
  get createdAt() { return this.props.createdAt }
  get updatedAt() { return this.props.updatedAt }
  get roleName() { return this.props.roleName }

  static create(data: UserCreate): User {
    return new User({
      id: data.id,
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      roleId: data.roleId,
      active: false,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  static fromDB(data: UserProps) {
    return new User(data)
  }

  toDB() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { roleName, ...rest } = this.props
    return rest
  }

  toResult(): UserResult {
    return {
      id: this.props.id,
      email: this.props.email,
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      roleId: this.props.roleId,
      active: this.props.active,
      emailVerified: this.props.emailVerified,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
      roleName: this.props.roleName,
    }
  }

  toUserInfo(): UserInfo {
    return {
      id: this.props.id,
      email: this.props.email,
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      roleId: this.props.roleId,
      roleName: this.props.roleName,
    }
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  rename(firstName: string, lastName: string) {
    this.props.firstName = firstName
    this.props.lastName = lastName
    this.touch()
  }

  activate() {
    this.props.active = true
    this.touch()
  }

  verifyEmail() {
    this.props.emailVerified = true
    this.touch()
  }

  changePassword(hashedPassword: string) {
    this.props.password = hashedPassword
    this.touch()
  }

  setActive(active: boolean) {
    this.props.active = active
    this.touch()
  }

  setRole(roleId: string) {
    this.props.roleId = roleId
    this.touch()
  }
}
