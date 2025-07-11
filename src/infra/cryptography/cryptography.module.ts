import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { EnvModule, EnvService } from 'src/common/env'
import { Encrypter } from 'src/domain/application/cryptography/encrypter.contract'
import { Hasher } from 'src/domain/application/cryptography/hasher.contract'
import { BcryptHasherImpl } from './bcrypt-hasher.impl'
import { JwtEncrypterImpl } from './jwt-encrypter.impl'

@Module({
  imports: [
    EnvModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (env: EnvService) => ({
        secret: env.get('JWT_SECRET'),
      }),
    }),
  ],
  providers: [
    { provide: Encrypter, useClass: JwtEncrypterImpl },
    { provide: Hasher, useClass: BcryptHasherImpl },
  ],
  exports: [Encrypter, Hasher],
})
export class CryptographyModule {}
