import { Injectable } from '@nestjs/common'
import { compare, hash } from 'bcryptjs'
import { Hasher } from 'src/domain/application/cryptography/hasher.contract'

@Injectable()
export class BcryptHasherImpl implements Hasher {
  private HASH_SALT_LENGTH = 2

  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH)
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }
}
