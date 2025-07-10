import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EnvService } from './common/env'
import {
  HttpExceptionFilter,
  ValidationException,
  ValidationExceptionFilter,
} from './common/exception'
import { LoggerService } from './common/logger'

async function bootstrap() {
  const logger = new LoggerService('Bootstrap')

  const app = await NestFactory.create(AppModule)

  const configService = app.get(EnvService)

  app.enableCors()
  app.useGlobalFilters(new HttpExceptionFilter())

  app.useGlobalFilters(new ValidationExceptionFilter())
  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: false,
      exceptionFactory: (errors: any) => {
        const exceptions = errors.map(error => {
          return Object.values(error.constraints).join('')
        })
        return new ValidationException(exceptions)
      },
    })
  )

  const port = configService.get('PORT')

  await app.listen(port, () => {
    logger.log('Bootstrap', `Server running on port ${port}`)
  })
}
bootstrap()
