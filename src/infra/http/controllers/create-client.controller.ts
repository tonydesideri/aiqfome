import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { ERROR_TYPES } from 'src/core/src/errors'
import { CreateClientUseCase } from 'src/domain/application/use-cases/create-client.use-case'
import { CreateClientDto } from '../dtos/create-client.dto'
import { ClientPresenter } from '../presenters'

@ApiTags('Clientes')
@ApiBearerAuth('JWT-auth')
@Controller('/clients')
export class CreateClientController {
  constructor(private createClientUseCase: CreateClientUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar cliente',
    description: 'Cria um novo cliente no sistema',
  })
  @ApiResponse({
    status: 201,
    description: 'Cliente criado com sucesso',
    schema: {
      type: 'object',
      properties: {
        client: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            name: { type: 'string', example: 'João Silva' },
            email: { type: 'string', example: 'joao.silva@email.com' },
            createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
            updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Cliente já existe com este email',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
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
