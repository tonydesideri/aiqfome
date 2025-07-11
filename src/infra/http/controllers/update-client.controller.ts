import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common'
import { ERROR_TYPES } from 'src/core/src/errors'
import { UpdateClientUseCase } from 'src/domain/application/use-cases/update-client.use-case'
import { UpdateClientDto } from '../dtos/update-client.dto'
import { ClientPresenter } from '../presenters'

@Controller('/clients')
export class UpdateClientController {
  constructor(private updateClientUseCase: UpdateClientUseCase) {}

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async handle(@Param('id') id: string, @Body() body: UpdateClientDto) {
    const { name, email } = body

    const result = await this.updateClientUseCase.execute({ id, name, email })

    if (result.isFailure()) {
      const error = result.value

      switch (error.errorType) {
        case ERROR_TYPES.RESOURCE_NOT_FOUND:
          throw new NotFoundException(error.message)
        case ERROR_TYPES.RESOURCE_EXISTS:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { client } = result.value

    return { client: ClientPresenter.toHTTP(client) }
  }
}
