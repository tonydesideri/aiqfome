import { Module } from '@nestjs/common'
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { EnvModule } from './common/env'
import {
  HttpExceptionFilter,
  ValidationExceptionFilter,
} from './common/exception'
import { LoggingInterceptor } from './common/interceptor'
import { LoggerModule } from './common/logger'
import { HttpModule } from './infra/http/http.module'

@Module({
  imports: [EnvModule, LoggerModule, HttpModule],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
