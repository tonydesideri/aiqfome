import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { ERROR_TYPES } from 'src/core/src/errors'
import { AddFavoriteUseCase } from 'src/domain/application/use-cases/add-favorite.use-case'
import { AddFavoriteDto } from '../dtos/add-favorite.dto'
import { FavoritePresenter } from '../presenters'

@ApiTags('Favoritos')
@ApiBearerAuth('JWT-auth')
@Controller('/favorites')
export class AddFavoriteController {
  constructor(private addFavoriteUseCase: AddFavoriteUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Adicionar favorito',
    description: 'Adiciona um produto à lista de favoritos de um cliente',
  })
  @ApiResponse({
    status: 201,
    description: 'Favorito adicionado com sucesso',
    schema: {
      type: 'object',
      properties: {
        favorite: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            clientId: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            productId: { type: 'string', example: '1' },
            createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente não encontrado ou produto não encontrado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['Cliente não encontrado'],
        },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Produto já está na lista de favoritos',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  async handle(@Body() body: AddFavoriteDto) {
    const { clientId, productId } = body

    const result = await this.addFavoriteUseCase.execute({
      clientId,
      productId,
    })

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

    const { favorite } = result.value

    return { favorite: FavoritePresenter.toHTTP(favorite) }
  }
}
