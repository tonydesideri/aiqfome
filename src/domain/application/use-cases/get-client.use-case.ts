import { Injectable } from '@nestjs/common'
import { ERROR_TYPES, ValidationError } from 'src/core/src/errors'
import { type Either, failure, success } from 'src/core/src/types'
import { Client } from '../../enterprise/client.entity'
import { ClientRepository } from '../repositories/client-repository.contract'

interface GetClientUseCaseRequest {
  id: string
}

type GetClientUseCaseResponse = Either<
  ValidationError<ERROR_TYPES.RESOURCE_NOT_FOUND>,
  {
    client: Client
  }
>

@Injectable()
export class GetClientUseCase {
  constructor(private clientRepository: ClientRepository) {}

  async execute({
    id,
  }: GetClientUseCaseRequest): Promise<GetClientUseCaseResponse> {
    const client = await this.clientRepository.findById(id)

    if (!client) {
      return failure(
        new ValidationError(
          ERROR_TYPES.RESOURCE_NOT_FOUND,
          'Cliente não encontrado'
        )
      )
    }

    return success({ client })
  }
}
