import { Injectable } from '@nestjs/common'
import { ERROR_TYPES, ValidationError } from 'src/core/src/errors'
import { type Either, failure, success } from 'src/core/src/types'
import { ClientRepository } from '../repositories/client-repository.contract'

interface DeleteClientUseCaseRequest {
  id: string
}

type DeleteClientUseCaseResponse = Either<
  ValidationError<ERROR_TYPES.RESOURCE_NOT_FOUND>,
  {}
>

@Injectable()
export class DeleteClientUseCase {
  constructor(private clientRepository: ClientRepository) {}

  async execute({
    id,
  }: DeleteClientUseCaseRequest): Promise<DeleteClientUseCaseResponse> {
    const client = await this.clientRepository.findById(id)

    if (!client) {
      return failure(
        new ValidationError(
          ERROR_TYPES.RESOURCE_NOT_FOUND,
          'Cliente não encontrado'
        )
      )
    }

    await this.clientRepository.delete(id)

    return success({})
  }
}
