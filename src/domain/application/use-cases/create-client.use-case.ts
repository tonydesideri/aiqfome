import { Injectable } from '@nestjs/common'
import { ERROR_TYPES, ValidationError } from 'src/core/src/errors'
import { type Either, failure, success } from 'src/core/src/types'
import { Client } from '../../enterprise/client.entity'
import { ClientRepository } from '../repositories/client-repository.contract'

interface CreateClientUseCaseRequest {
  name: string
  email: string
}

type CreateClientUseCaseResponse = Either<
  ValidationError<ERROR_TYPES.RESOURCE_EXISTS>,
  {
    client: Client
  }
>

@Injectable()
export class CreateClientUseCase {
  constructor(private clientRepository: ClientRepository) {}

  async execute({
    name,
    email,
  }: CreateClientUseCaseRequest): Promise<CreateClientUseCaseResponse> {
    const existing = await this.clientRepository.findByEmail(email)

    if (existing) {
      return failure(
        new ValidationError(ERROR_TYPES.RESOURCE_EXISTS, 'E-mail já cadastrado')
      )
    }

    const client = Client.instance({ name, email })

    await this.clientRepository.create(client)

    return success({ client })
  }
}
