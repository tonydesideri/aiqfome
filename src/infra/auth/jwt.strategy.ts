import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserPayload } from 'src/common/decorators'
// biome-ignore lint/style/useImportType: <explanation>
import { EnvService } from 'src/common/env'
import { UserRepository } from 'src/domain/application/repositories/user-repository.contract'

interface JwtPayload {
  sub: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private env: EnvService,
    private userRepository: UserRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.get('JWT_SECRET'),
    })
  }

  async validate({ sub }: JwtPayload): Promise<UserPayload> {
    const user = await this.userRepository.findById(sub)

    if (!user) {
      throw new UnauthorizedException()
    }

    return {
      id: user.id.toString(),
      email: user.email,
    }
  }
}
