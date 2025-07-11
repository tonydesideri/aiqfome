import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Encrypter } from 'src/domain/application/cryptography/encrypter.contract'

@Injectable()
export class JwtEncrypterImpl implements Encrypter {
  constructor(private jwtService: JwtService) {}

  async encrypt(
    payload: Record<string, unknown>,
    expiresIn: string
  ): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      expiresIn,
    })
  }

  async verify(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token)
    } catch (_error) {
      return false
    }
  }
}
