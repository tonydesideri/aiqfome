import { Injectable } from '@nestjs/common'
import { ERROR_TYPES, ValidationError } from 'src/core/src/errors'
import { type Either, failure, success } from 'src/core/src/types'
import { Encrypter } from '../cryptography/encrypter.contract'
import { Hasher } from '../cryptography/hasher.contract'
import { UserRepository } from '../repositories/user-repository.contract'

interface SignInUseCaseRequest {
  email: string
  password: string
}

type SignInUseCaseResponse = Either<
  ValidationError<ERROR_TYPES.INVALID_CREDENTIALS>,
  {
    accessToken: string
  }
>

@Injectable()
export class SignInUseCase {
  private ACCESS_TOKEN_EXPIRES_IN = '1d'

  constructor(
    private userRepository: UserRepository,
    private hasher: Hasher,
    private encrypter: Encrypter
  ) {}

  async execute({
    email,
    password,
  }: SignInUseCaseRequest): Promise<SignInUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      return failure(
        new ValidationError(
          ERROR_TYPES.INVALID_CREDENTIALS,
          'Invalid credentials'
        )
      )
    }

    const isPasswordValid = await this.hasher.compare(password, user.password)

    if (!isPasswordValid) {
      return failure(
        new ValidationError(
          ERROR_TYPES.INVALID_CREDENTIALS,
          'Invalid credentials'
        )
      )
    }

    const accessToken = await this.encrypter.encrypt(
      {
        sub: user.id.toString(),
      },
      this.ACCESS_TOKEN_EXPIRES_IN
    )

    await this.userRepository.save(user)

    return success({
      accessToken,
    })
  }
}
