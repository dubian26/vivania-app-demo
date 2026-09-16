import { HttpClient, type HttpClientOptions } from "@/lib/http-client"
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
}

export const createPermissionRepo = (options: HttpClientOptions = {}) =>
  new PermissionRepository(options)
