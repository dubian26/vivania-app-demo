import { PasswordHasher } from '@js-core/domain/contracts'
import { Injectable } from '@js-core/domain/util'
import { compare, hash } from 'bcryptjs'

@Injectable()
export class BcryptPasswordHasher implements PasswordHasher {
  private static readonly SALT_ROUNDS = 10

  hash(password: string): Promise<string> {
    return hash(password, BcryptPasswordHasher.SALT_ROUNDS)
  }

  compare(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword)
  }
}
