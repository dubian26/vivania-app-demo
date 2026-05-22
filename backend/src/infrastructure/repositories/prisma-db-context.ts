import { PrismaDbClient } from '@/infrastructure/repositories/prisma-db-types'
import { Injectable } from '@base/core/util'
import { OnModuleDestroy } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { Prisma, PrismaClient } from '@prisma/client'
import { AsyncLocalStorage } from 'node:async_hooks'
import { Pool } from 'pg'

@Injectable()
export class PrismaDbContext implements OnModuleDestroy {
  private readonly storage = new AsyncLocalStorage<Prisma.TransactionClient>()
  private readonly pool: Pool
  private readonly rootClient: PrismaClient

  constructor() {
    const connectionString = process.env.DATABASE_URL

    if (!connectionString) {
      const msg = 'DATABASE_URL no está definida'
      throw new Error(msg)
    }

    this.pool = new Pool({ connectionString })
    this.rootClient = new PrismaClient({
      adapter: new PrismaPg(this.pool),
    })
  }

  client(): PrismaDbClient {
    return this.storage.getStore() ?? this.rootClient
  }

  async runInTransaction<T>(work: () => Promise<T>): Promise<T> {
    const activeTransaction = this.storage.getStore()

    if (activeTransaction) {
      return work()
    }

    return this.rootClient.$transaction(async (transaction) => {
      return this.storage.run(transaction, work)
    })
  }

  async onModuleDestroy(): Promise<void> {
    await this.rootClient.$disconnect()
    await this.pool.end()
  }
}
