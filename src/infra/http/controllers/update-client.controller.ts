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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { ERROR_TYPES } from 'src/core/src/errors'
import { UpdateClientUseCase } from 'src/domain/application/use-cases/update-client.use-case'
import { UpdateClientDto } from '../dtos/update-client.dto'
import { ClientPresenter } from '../presenters'

@ApiTags('Clientes')
@ApiBearerAuth('JWT-auth')
@Controller('/clients')
export class UpdateClientController {
  constructor(private updateClientUseCase: UpdateClientUseCase) {}

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Atualizar cliente',
    description: 'Atualiza os dados de um cliente existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do cliente',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente atualizado com sucesso',
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
            name: { type: 'string', example: 'João Silva Atualizado' },
            email: {
              type: 'string',
              example: 'joao.silva.atualizado@email.com',
            },
            createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
            updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente não encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Email já está em uso por outro cliente',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
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
