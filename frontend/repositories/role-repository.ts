import type {
  RoleCreateModel,
  RoleModel,
  RoleUpdateModel,
} from "@/models/role-model"

import { HttpClient, type HttpClientOptions } from "@/lib/http-client"
import type { IdResult } from "@/models/id-result"
import type { Result } from "@/models/result"
import type { SearchModel } from "@/models/search-model"

class RoleRepository extends HttpClient {
  async listAll(): Promise<RoleModel[]> {
    const response = await this.http("GET", "/roles", { cache: "no-store" })
    const data = await this.getData<RoleModel[]>(response)
    return data ?? []
  }

  async search(params: SearchModel): Promise<Result<RoleModel>> {
    const query = new URLSearchParams({
      skip: String(params.skip),
      take: String(params.take),
    })

    if (params.search) query.set("search", params.search)

    const url = `/roles/search?${query.toString()}`
    const response = await this.http("GET", url, { cache: "no-store" })
    const result = await this.getData<Result<RoleModel>>(response)
    return result ?? { totalRows: 0, data: [] }
  }

  async create(payload: RoleCreateModel): Promise<IdResult | undefined> {
    const response = await this.http("POST", "/roles", { body: payload })
    return this.getData<IdResult>(response)
  }

  async update(payload: RoleUpdateModel): Promise<IdResult | undefined> {
    const response = await this.http("PUT", "/roles", { body: payload })
    return this.getData<IdResult>(response)
  }

  async delete(id: string): Promise<IdResult | undefined> {
    const response = await this.http("DELETE", `/roles/${id}`)
    return this.getData<IdResult>(response)
  }
}

export const createRoleRepo = (options: HttpClientOptions = {}) =>
  new RoleRepository(options)
