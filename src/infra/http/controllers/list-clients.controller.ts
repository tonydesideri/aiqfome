import { Controller, Get } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { ListClientsUseCase } from 'src/domain/application/use-cases/list-clients.use-case'
import { ClientPresenter } from '../presenters'

@ApiTags('Clientes')
@ApiBearerAuth('JWT-auth')
@Controller('/clients')
export class ListClientsController {
  constructor(private listClientsUseCase: ListClientsUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Listar clientes',
    description: 'Retorna todos os clientes cadastrados no sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes retornada com sucesso',
    schema: {
      type: 'object',
      properties: {
        clients: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '123e4567-e89b-12d3-a456-426614174000',
              },
              name: { type: 'string', example: 'João Silva' },
              email: { type: 'string', example: 'joao.silva@email.com' },
              createdAt: {
                type: 'string',
                example: '2024-01-01T00:00:00.000Z',
              },
              updatedAt: {
                type: 'string',
                example: '2024-01-01T00:00:00.000Z',
              },
            },
          },
        },
      },
    },
  })
  async handle() {
    const result = await this.listClientsUseCase.execute()
    const { clients } = result.value
    return { clients: clients.map(ClientPresenter.toHTTP) }
  }
}
