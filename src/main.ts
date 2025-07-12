import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
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

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('AiqFome API')
    .setDescription('API para gerenciamento de clientes e favoritos do AiqFome')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth'
    )
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  })

  const port = configService.get('PORT')

  await app.listen(port, () => {
    logger.log('Bootstrap', `Server running on port ${port}`)
    logger.log(
      'Bootstrap',
      `Swagger documentation available at http://localhost:${port}/api`
    )
  })
}
bootstrap()
