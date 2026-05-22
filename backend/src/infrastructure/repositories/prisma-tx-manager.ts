import { PrismaDbContext } from '@/infrastructure/repositories/prisma-db-context'
import { TxManager } from '@base/core/contracts'
import { Injectable } from '@base/core/util'

@Injectable()
export class PrismaTxManager implements TxManager {
  constructor(private readonly dbContext: PrismaDbContext) { }

  run<T>(work: () => Promise<T>): Promise<T> {
    return this.dbContext.runInTransaction(work)
  }
}
