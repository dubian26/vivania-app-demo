import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  const msg = 'DATABASE_URL no está definida'
  throw new Error(msg)
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

export const dbClient = new PrismaClient({ adapter })
