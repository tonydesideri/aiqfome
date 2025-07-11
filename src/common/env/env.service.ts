import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EnvVariables } from './env.validation'

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService<EnvVariables, true>) {}

  get<T extends keyof EnvVariables>(key: T) {
    return this.configService.get(key, { infer: true })
  }
}
