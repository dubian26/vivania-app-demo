import { HttpClient, type HttpClientOptions } from "@/lib/http-client"
import type { IdResult } from "@/models/id-result"
import type { PermissionModel } from "@/models/permission-model"

class PermissionRepository extends HttpClient {
  // Permissions assigned to a role (GET /permissions/role/:roleId).
  // The menu is derived from these; requires a valid session cookie.
  async listByRole(roleId: string): Promise<PermissionModel[]> {
    const url = `/permissions/role/${roleId}`
    const response = await this.fetch(url, { method: "GET", cache: "no-store" })
    const data = await this.getData<PermissionModel[]>(response)
    return data ?? []
  }

  // Full permission catalog (GET /permissions). Flat; link nodes by parentId.
  async listAll(): Promise<PermissionModel[]> {
    const response = await this.fetch("/permissions", {
      method: "GET",
      cache: "no-store",
    })
    const data = await this.getData<PermissionModel[]>(response)
    return data ?? []
  }

  // Replaces the permissions assigned to a role
  // (POST /permissions/role/:roleId). Requires valid session + permission.
  async saveRolePermissions(
    roleId: string,
    permissionIds: string[]
  ): Promise<IdResult | undefined> {
    const response = await this.fetch(`/permissions/role/${roleId}`, {
      body: { permissionIds },
    })
    return this.getData<IdResult>(response)
  }
}

export const createPermissionRepo = (options: HttpClientOptions = {}) =>
  new PermissionRepository(options)
