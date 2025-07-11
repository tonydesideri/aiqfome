import { Module } from '@nestjs/common'
import { EnvModule } from 'src/common/env'
import { LoggerModule } from 'src/common/logger'
import { UserRepository } from 'src/domain/application/repositories/user-repository.contract'
import { PrismaService } from './prisma/prisma.service'
import { PrismaUserRepositoryImpl } from './prisma/repositories/prisma-user-repository.impl'

@Module({
  imports: [EnvModule, LoggerModule],
  providers: [
    PrismaService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepositoryImpl,
    },
  ],
  exports: [PrismaService, UserRepository],
})
export class PersistenceModule {}
