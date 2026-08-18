// Authenticated user data returned by the backend in the login body.
// Tokens do not travel here: the backend sets them as httpOnly cookies.
export interface UserInfoModel {
  id: string
  email: string
  firstName: string
  lastName: string
  roleId: string
  roleName?: string
}
