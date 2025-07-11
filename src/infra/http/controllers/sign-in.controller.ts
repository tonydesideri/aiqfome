import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import { Public } from 'src/common/decorators'
import { ERROR_TYPES } from 'src/core/src/errors'
import { SignInUseCase } from 'src/domain/application/use-cases/sign-in.use-case'
import { SignInDto } from '../dtos/sign-in.dto'

@Public()
@Controller('/auth/sign-in')
export class SignInController {
  constructor(private signInUseCase: SignInUseCase) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async handle(@Body() body: SignInDto) {
    const { email, password } = body

    const result = await this.signInUseCase.execute({
      email,
      password,
    })

    if (result.isFailure()) {
      const error = result.value

      switch (error.errorType) {
        case ERROR_TYPES.INVALID_CREDENTIALS:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return { accessToken }
  }
}
