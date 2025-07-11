import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common'
import { ERROR_TYPES } from 'src/core/src/errors'
import { CreateClientUseCase } from 'src/domain/application/use-cases/create-client.use-case'
import { CreateClientDto } from '../dtos/create-client.dto'
import { ClientPresenter } from '../presenters'

@Controller('/clients')
export class CreateClientController {
  constructor(private createClientUseCase: CreateClientUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async handle(@Body() body: CreateClientDto) {
    const { name, email } = body

    const result = await this.createClientUseCase.execute({ name, email })

    if (result.isFailure()) {
      const error = result.value

      switch (error.errorType) {
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
