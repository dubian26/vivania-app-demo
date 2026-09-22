import { HttpClient, type HttpClientOptions } from "@/lib/http-client"
import type { IdResult } from "@/models/id-result"
import type { RoleCreateModel, RoleModel, RoleUpdateModel } from "@/models/role-model"
import type { SearchModel } from "@/models/search-model"

class RoleRepository extends HttpClient {
  async listAll(): Promise<RoleModel[]> {
    const response = await this.fetch("/roles", { method: "GET", cache: "no-store" })
    const data = await this.getData<RoleModel[]>(response)
    return data ?? []
  }

  async search(params: SearchModel): Promise<RoleModel[]> {
    const query = new URLSearchParams({
      skip: String(params.skip),
      take: String(params.take),
    })

    if (params.search) query.set("search", params.search)

    const url = `/roles/search?${query.toString()}`
    const response = await this.fetch(url, { method: "GET", cache: "no-store" })
    const data = await this.getData<RoleModel[]>(response)
    return data ?? []
  }

  async create(payload: RoleCreateModel): Promise<IdResult | undefined> {
    const response = await this.fetch("/roles", { body: payload })
    return this.getData<IdResult>(response)
  }

  async update(payload: RoleUpdateModel): Promise<IdResult | undefined> {
    const response = await this.fetch("/roles", { method: "PUT", body: payload })
    return this.getData<IdResult>(response)
  }

  async delete(id: string): Promise<IdResult | undefined> {
    const response = await this.fetch(`/roles/${id}`, { method: "DELETE" })
    return this.getData<IdResult>(response)
  }
}

export const createRoleRepo = (options: HttpClientOptions = {}) =>
  new RoleRepository(options)
