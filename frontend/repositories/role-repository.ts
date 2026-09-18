import { HttpClient, type HttpClientOptions } from "@/lib/http-client"
import type { RoleModel } from "@/models/role-model"

class RoleRepository extends HttpClient {
  // All roles (GET /roles). Used to populate the role selector.
  // Requires a valid session cookie.
  async listAll(): Promise<RoleModel[]> {
    const response = await this.fetch("/roles", {
      method: "GET",
      cache: "no-store",
    })
    const data = await this.getData<RoleModel[]>(response)
    return data ?? []
  }

  // Offset pagination over roles (GET /roles/search?skip&take).
  // Requires a valid session cookie.
  async search(params: {
    skip: number
    take: number
  }): Promise<RoleModel[]> {
    const query = new URLSearchParams({
      skip: String(params.skip),
      take: String(params.take),
    })

    const response = await this.fetch(`/roles/search?${query.toString()}`, {
      method: "GET",
      cache: "no-store",
    })
    const data = await this.getData<RoleModel[]>(response)
    return data ?? []
  }
}

export const createRoleRepo = (options: HttpClientOptions = {}) =>
  new RoleRepository(options)
