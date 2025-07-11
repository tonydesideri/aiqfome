import { Injectable } from '@nestjs/common'
import { ERROR_TYPES, ValidationError } from 'src/core/src/errors'
import { type Either, failure, success } from 'src/core/src/types'
import { Favorite } from '../../enterprise/favorite.entity'
import { FavoriteRepository } from '../repositories/favorite-repository.contract'
import { ProductRepository } from '../repositories/product-repository.contract'

interface AddFavoriteUseCaseRequest {
  clientId: string
  productId: string
}

type AddFavoriteUseCaseResponse = Either<
  ValidationError<ERROR_TYPES.RESOURCE_NOT_FOUND | ERROR_TYPES.RESOURCE_EXISTS>,
  {
    favorite: Favorite
  }
>

@Injectable()
export class AddFavoriteUseCase {
  constructor(
    private favoriteRepository: FavoriteRepository,
    private productRepository: ProductRepository
  ) {}

  async execute({
    clientId,
    productId,
  }: AddFavoriteUseCaseRequest): Promise<AddFavoriteUseCaseResponse> {
    // Verifica se o produto existe na API externa
    const product = await this.productRepository.findById(productId)
    if (!product) {
      return failure(
        new ValidationError(
          ERROR_TYPES.RESOURCE_NOT_FOUND,
          'Produto não encontrado'
        )
      )
    }

    // Verifica se já foi favoritado
    const existingFavorite =
      await this.favoriteRepository.findByClientAndProduct(clientId, productId)
    if (existingFavorite) {
      return failure(
        new ValidationError(
          ERROR_TYPES.RESOURCE_EXISTS,
          'Produto já foi favoritado'
        )
      )
    }

    const favorite = Favorite.instance({ clientId, productId })
    await this.favoriteRepository.create(favorite)

    return success({ favorite })
  }
}
