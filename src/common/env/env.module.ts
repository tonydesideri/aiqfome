import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvService } from './env.service';
import { validate } from './env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => validate(env),
    }),
  ],
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
