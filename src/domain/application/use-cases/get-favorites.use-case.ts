import { Injectable } from '@nestjs/common'
import { type Either, success } from 'src/core/src/types'
import { Favorite } from '../../enterprise/favorite.entity'
import { Product } from '../../enterprise/product.entity'
import { FavoriteRepository } from '../repositories/favorite-repository.contract'
import { ProductRepository } from '../repositories/product-repository.contract'

interface GetFavoritesUseCaseRequest {
  clientId: string
}

type GetFavoritesUseCaseResponse = Either<
  never,
  {
    favorites: Array<{ favorite: Favorite; product: Product | null }>
  }
>

@Injectable()
export class GetFavoritesUseCase {
  constructor(
    private favoriteRepository: FavoriteRepository,
    private productRepository: ProductRepository
  ) {}

  async execute({
    clientId,
  }: GetFavoritesUseCaseRequest): Promise<GetFavoritesUseCaseResponse> {
    const favorites = await this.favoriteRepository.findByClient(clientId)

    // Busca dados dos produtos para enriquecer a resposta
    const favoritesWithProducts = await Promise.all(
      favorites.map(async favorite => {
        const product = await this.productRepository.findById(
          favorite.productId
        )
        return { favorite, product }
      })
    )

    return success({ favorites: favoritesWithProducts })
  }
}
