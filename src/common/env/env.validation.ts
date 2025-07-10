import { plainToInstance } from 'class-transformer'
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator'

enum Environment {
  Development = 'development',
  Production = 'production',
  QA = 'qa',
}

export class EnvVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment

  @IsString()
  DATABASE_URL: string

  @IsNumber()
  PORT: number
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvVariables, config, {
    enableImplicitConversion: true,
  })

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  })

  if (errors.length > 0) {
    throw new Error(errors.toString())
  }
  return validatedConfig
}
