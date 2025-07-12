import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { ERROR_TYPES } from 'src/core/src/errors'
import { GetClientUseCase } from 'src/domain/application/use-cases/get-client.use-case'
import { ClientPresenter } from '../presenters'

@ApiTags('Clientes')
@ApiBearerAuth('JWT-auth')
@Controller('/clients')
export class GetClientController {
  constructor(private getClientUseCase: GetClientUseCase) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar cliente por ID',
    description: 'Retorna os dados de um cliente específico',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do cliente',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente encontrado com sucesso',
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
    status: 404,
    description: 'Cliente não encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
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
