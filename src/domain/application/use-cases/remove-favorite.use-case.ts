import { Injectable } from '@nestjs/common'
import { ERROR_TYPES, ValidationError } from 'src/core/src/errors'
import { type Either, failure, success } from 'src/core/src/types'
import { FavoriteRepository } from '../repositories/favorite-repository.contract'

interface RemoveFavoriteUseCaseRequest {
  clientId: string
  productId: string
}

type RemoveFavoriteUseCaseResponse = Either<
  ValidationError<ERROR_TYPES.RESOURCE_NOT_FOUND>,
  {}
>

@Injectable()
export class RemoveFavoriteUseCase {
  constructor(private favoriteRepository: FavoriteRepository) {}

  async execute({
    clientId,
    productId,
  }: RemoveFavoriteUseCaseRequest): Promise<RemoveFavoriteUseCaseResponse> {
    // Verifica se o favorito existe
    const existingFavorite =
      await this.favoriteRepository.findByClientAndProduct(clientId, productId)

    if (!existingFavorite) {
      return failure(
        new ValidationError(
          ERROR_TYPES.RESOURCE_NOT_FOUND,
          'Favorito não encontrado'
        )
      )
    }

    await this.favoriteRepository.delete(clientId, productId)
    return success({})
  }
}
