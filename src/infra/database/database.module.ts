import { Module } from '@nestjs/common'
import { EnvModule } from 'src/common/env'
import { LoggerModule } from 'src/common/logger'
import { ClientRepository } from 'src/domain/application/repositories/client-repository.contract'
import { FavoriteRepository } from 'src/domain/application/repositories/favorite-repository.contract'
import { UserRepository } from 'src/domain/application/repositories/user-repository.contract'
import { PrismaService } from './prisma/prisma.service'
import { PrismaClientRepositoryImpl } from './prisma/repositories/prisma-client-repository.impl'
import { PrismaFavoriteRepositoryImpl } from './prisma/repositories/prisma-favorite-repository.impl'
import { PrismaUserRepositoryImpl } from './prisma/repositories/prisma-user-repository.impl'

@Module({
  imports: [EnvModule, LoggerModule],
  providers: [
    PrismaService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepositoryImpl,
    },
    {
      provide: ClientRepository,
      useClass: PrismaClientRepositoryImpl,
    },
    {
      provide: FavoriteRepository,
      useClass: PrismaFavoriteRepositoryImpl,
    },
  ],
  exports: [
    PrismaService,
    UserRepository,
    ClientRepository,
    FavoriteRepository,
  ],
})
export class DatabaseModule {}
