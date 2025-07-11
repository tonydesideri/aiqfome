import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { ERROR_TYPES } from 'src/core/src/errors'
import { GetClientUseCase } from 'src/domain/application/use-cases/get-client.use-case'
import { ClientPresenter } from '../presenters'

@Controller('/clients')
export class GetClientController {
  constructor(private getClientUseCase: GetClientUseCase) {}

  @Get(':id')
  async handle(@Param('id') id: string) {
    const result = await this.getClientUseCase.execute({ id })

    if (result.isFailure()) {
      const error = result.value

      switch (error.errorType) {
        case ERROR_TYPES.RESOURCE_NOT_FOUND:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { client } = result.value

    return { client: ClientPresenter.toHTTP(client) }
  }
}
