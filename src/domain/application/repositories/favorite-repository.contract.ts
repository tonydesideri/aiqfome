import { Favorite } from '../../enterprise/favorite.entity'

export abstract class FavoriteRepository {
  abstract create(favorite: Favorite): Promise<void>
  abstract findByClientAndProduct(
    clientId: string,
    productId: string
  ): Promise<Favorite | null>
  abstract findByClient(clientId: string): Promise<Favorite[]>
  abstract delete(clientId: string, productId: string): Promise<void>
}
