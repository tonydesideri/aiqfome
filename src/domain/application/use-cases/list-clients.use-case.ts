import { Injectable } from '@nestjs/common'
import { type Either, success } from 'src/core/src/types'
import { Client } from '../../enterprise/client.entity'
import { ClientRepository } from '../repositories/client-repository.contract'

type ListClientsUseCaseResponse = Either<
  never,
  {
    clients: Client[]
  }
>

@Injectable()
export class ListClientsUseCase {
  constructor(private clientRepository: ClientRepository) {}

  async execute(): Promise<ListClientsUseCaseResponse> {
    const clients = await this.clientRepository.findAll()
    return success({ clients })
  }
}
