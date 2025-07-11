import { Controller, Get } from '@nestjs/common'
import { ListClientsUseCase } from 'src/domain/application/use-cases/list-clients.use-case'
import { ClientPresenter } from '../presenters'

@Controller('/clients')
export class ListClientsController {
  constructor(private listClientsUseCase: ListClientsUseCase) {}

  @Get()
  async handle() {
    const result = await this.listClientsUseCase.execute()
    const { clients } = result.value
    return { clients: clients.map(ClientPresenter.toHTTP) }
  }
}
