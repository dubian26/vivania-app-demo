import { PrismaDbContext } from '@/infrastructure/repositories/prisma-db-context'
import { TxManager } from '@/base/contracts/tx-manager'
import { Injectable } from '@/base/util/injectable'

@Injectable()
export class PrismaTxManager implements TxManager {
  constructor(private readonly dbContext: PrismaDbContext) { }

  run<T>(work: () => Promise<T>): Promise<T> {
    return this.dbContext.runInTransaction(work)
  }
}
