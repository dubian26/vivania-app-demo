import { HttpClient, type HttpClientOptions } from "@/lib/http-client"
import type { IdResult } from "@/models/id-result"
import type { PermissionModel, PermissionSaveRoleModel } from "@/models/permission-model"

class PermissionRepository extends HttpClient {
  // Permissions assigned to a role (GET /permissions/role/:roleId).
  // The menu is derived from these; requires a valid session cookie.
  async listByRole(roleId: string): Promise<PermissionModel[]> {
    const url = `/permissions/role/${roleId}`
    const response = await this.http("GET", url, { cache: "no-store" })
    const data = await this.getData<PermissionModel[]>(response)
    return data ?? []
  }

  // Full permission catalog (GET /permissions). Flat; link nodes by parentId.
  async listAll(): Promise<PermissionModel[]> {
    const response = await this.http("GET", "/permissions", { cache: "no-store" })
    const data = await this.getData<PermissionModel[]>(response)
    return data ?? []
  }

  // Replaces the permissions assigned to a role
  // (POST /permissions/role/:roleId). Requires valid session + permission.
  async saveRolePermissions(params: PermissionSaveRoleModel): Promise<IdResult | undefined> {
    const url = `/permissions/role/${params.roleId}`
    const body = { permissionIds: params.permissionIds }
    const response = await this.http("POST", url, { body })
    return this.getData<IdResult>(response)
  }
}

export const createPermissionRepo = (options: HttpClientOptions = {}) =>
  new PermissionRepository(options)
