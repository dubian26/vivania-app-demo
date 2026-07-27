import { PrismaDbContext } from '@/infrastructure/repositories/prisma-db-context'
import { TxManager } from '@js-core/domain/contracts'
import { Injectable } from '@js-core/domain/util'

@Injectable()
export class PrismaTxManager implements TxManager {
  constructor(private readonly dbContext: PrismaDbContext) { }

  run<T>(work: () => Promise<T>): Promise<T> {
    return this.dbContext.runInTransaction(work)
  }
}
