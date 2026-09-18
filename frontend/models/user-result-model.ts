// User returned by the backend in list/search/get operations (UserResult).
// Password never travels here.
export interface UserResultModel {
  id: string
  email: string
  firstName: string
  lastName: string
  roleId: string
  active: boolean
  emailVerified: boolean
  createdAt: string
  updatedAt: string
  roleName?: string
}
