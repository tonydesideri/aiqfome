import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { GetFavoritesUseCase } from 'src/domain/application/use-cases/get-favorites.use-case'
import { ListFavoritesDto } from '../dtos/list-favorites.dto'
import { FavoritePresenter, ProductPresenter } from '../presenters'

@ApiTags('Favoritos')
@ApiBearerAuth('JWT-auth')
@Controller('/favorites')
export class ListFavoritesController {
  constructor(private getFavoritesUseCase: GetFavoritesUseCase) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar favoritos',
    description: 'Retorna a lista de favoritos de um cliente específico',
  })
  @ApiQuery({
    name: 'clientId',
    description: 'ID do cliente',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de favoritos retornada com sucesso',
    schema: {
      type: 'object',
      properties: {
        favorites: {
          type: 'array',
          items: {
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
              createdAt: {
                type: 'string',
                example: '2024-01-01T00:00:00.000Z',
              },
              product: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: '1' },
                  title: {
                    type: 'string',
                    example: 'Fjallraven - Foldsack No. 1 Backpack',
                  },
                  price: { type: 'number', example: 109.95 },
                  description: {
                    type: 'string',
                    example: 'Your perfect pack for everyday use...',
                  },
                  category: { type: 'string', example: "men's clothing" },
                  image: {
                    type: 'string',
                    example:
                      'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  async handle(@Query() query: ListFavoritesDto) {
    const { clientId } = query

    const result = await this.getFavoritesUseCase.execute({ clientId })

    const { favorites } = result.value

    return {
      favorites: favorites.map(favorite => ({
        ...FavoritePresenter.toHTTP(favorite.favorite),
        product: favorite.product
          ? ProductPresenter.toHTTP(favorite.product)
          : null,
      })),
    }
  }
}
