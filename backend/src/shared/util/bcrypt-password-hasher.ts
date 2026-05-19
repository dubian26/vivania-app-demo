import { PasswordHasher } from '@/shared/contracts/password-hasher'
import { Injectable } from '@/shared/util/injectable'
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
