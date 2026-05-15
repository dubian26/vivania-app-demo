import { PrismaDbContext } from '@/infrastructure/repositories/prisma-db-context'
import { Injectable } from '@/shared/util/injectable'
import { TxManager } from '@/shared/util/tx-manager'

@Injectable()
export class PrismaTxManager implements TxManager {
  constructor(private readonly dbContext: PrismaDbContext) {}

  run<T>(work: () => Promise<T>): Promise<T> {
    return this.dbContext.runInTransaction(work)
  }
}
