import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common'
import { GetFavoritesUseCase } from 'src/domain/application/use-cases/get-favorites.use-case'
import { ListFavoritesDto } from '../dtos/list-favorites.dto'
import { FavoritePresenter, ProductPresenter } from '../presenters'

@Controller('/favorites')
export class ListFavoritesController {
  constructor(private getFavoritesUseCase: GetFavoritesUseCase) {}

  @Get()
  @HttpCode(HttpStatus.OK)
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
