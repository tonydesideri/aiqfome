import { Module } from '@nestjs/common'
import { EnvModule } from 'src/common/env'
import { Encrypter } from 'src/domain/application/cryptography/encrypter.contract'
import { Hasher } from 'src/domain/application/cryptography/hasher.contract'
import { UserRepository } from 'src/domain/application/repositories/user-repository.contract'
import { SignInUseCase } from 'src/domain/application/use-cases/sign-in.use-case'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { PersistenceModule } from '../database/persistence.module'
import { SignInController } from './controllers/sign-in.controller'

@Module({
  imports: [EnvModule, PersistenceModule, CryptographyModule],
  controllers: [SignInController],
  providers: [
    {
      provide: SignInUseCase,
      useFactory: (
        userRepository: UserRepository,
        hasher: Hasher,
        encrypter: Encrypter
      ) => new SignInUseCase(userRepository, hasher, encrypter),
      inject: [UserRepository, Hasher, Encrypter],
    },
  ],
})
export class HttpModule {}
