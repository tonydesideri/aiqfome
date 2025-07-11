import {
  Injectable,
  type OnModuleDestroy,
  type OnModuleInit,
} from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { EnvService } from 'src/common/env'
import { LoggerService } from 'src/common/logger'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    private env: EnvService,
    private logger: LoggerService
  ) {
    super()
  }

  async onModuleInit() {
    await this.$connect()
    this.logger.debug(
      'PrismaService',
      `Database connected on stage ${this.env.get('NODE_ENV')}`
    )
  }

  async onModuleDestroy() {
    await this.$disconnect()
    this.logger.debug('PrismaService', 'Database disconnected')
  }
}
