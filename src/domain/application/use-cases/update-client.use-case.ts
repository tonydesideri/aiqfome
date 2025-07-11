import { Injectable } from '@nestjs/common'
import { ERROR_TYPES, ValidationError } from 'src/core/src/errors'
import { type Either, failure, success } from 'src/core/src/types'
import { Client } from '../../enterprise/client.entity'
import { ClientRepository } from '../repositories/client-repository.contract'

interface UpdateClientUseCaseRequest {
  id: string
  name: string
  email: string
}

type UpdateClientUseCaseResponse = Either<
  ValidationError<ERROR_TYPES.RESOURCE_NOT_FOUND | ERROR_TYPES.RESOURCE_EXISTS>,
  {
    client: Client
  }
>

@Injectable()
export class UpdateClientUseCase {
  constructor(private clientRepository: ClientRepository) {}

  async execute({
    id,
    name,
    email,
  }: UpdateClientUseCaseRequest): Promise<UpdateClientUseCaseResponse> {
    const client = await this.clientRepository.findById(id)
    if (!client) {
      return failure(
        new ValidationError(
          ERROR_TYPES.RESOURCE_NOT_FOUND,
          'Cliente não encontrado'
        )
      )
    }

    const existing = await this.clientRepository.findByEmail(email)
    if (existing && existing.id.toString() !== id) {
      return failure(
        new ValidationError(ERROR_TYPES.RESOURCE_EXISTS, 'E-mail já cadastrado')
      )
    }

    client.updateName(name)
    client.updateEmail(email)

    await this.clientRepository.save(client)

    return success({ client })
  }
}
