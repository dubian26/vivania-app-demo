import { VerifyCode } from '@/domain/verify-code/verify-code'
import { VerifyCodeRepository } from '@/domain/verify-code/verify-code-repository'
import { PrismaDbContext } from '@/infrastructure/repositories/prisma-db-context'
import { Injectable } from '@/shared/util/injectable'

@Injectable()
export class PrismaVerifyCodeRepository implements VerifyCodeRepository {
  constructor(private readonly dbContext: PrismaDbContext) { }

  async findById(id: string): Promise<VerifyCode | null> {
    const record = await this.dbContext.client().verifyCodes.findUnique({
      where: { id },
    })

    if (!record) return null
    const result = VerifyCode.fromDB(record)

    return result
  }

  async findByUserId(userId: string): Promise<VerifyCode[]> {
    const records = await this.dbContext.client().verifyCodes.findMany({
      where: { userId },
    })

    return records.map((record) => {
      return VerifyCode.fromDB(record)
    })
  }

  async findByCode(code: string, purpose: string): Promise<VerifyCode | null> {
    const record = await this.dbContext.client().verifyCodes.findFirst({
      where: { code, purpose },
    })

    if (!record) return null
    return VerifyCode.fromDB(record)
  }

  async insert(user: VerifyCode): Promise<void> {
    const { ...data } = user.toDB()
    await this.dbContext.client().verifyCodes.create({ data })
  }

  async update(user: VerifyCode): Promise<void> {
    const { id, ...data } = user.toDB()
    await this.dbContext.client().verifyCodes.update({
      where: { id },
      data: data,
    })
  }

  async delete(id: string): Promise<void> {
    await this.dbContext.client().verifyCodes.delete({
      where: { id },
    })
  }
}
