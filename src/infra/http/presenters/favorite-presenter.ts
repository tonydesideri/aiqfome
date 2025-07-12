import { Favorite } from 'src/domain/enterprise/favorite.entity'

export class FavoritePresenter {
  static toHTTP(favorite: Favorite) {
    return {
      id: favorite.id.toString(),
      clientId: favorite.clientId.toString(),
      productId: favorite.productId.toString(),
      createdAt: favorite.createdAt,
    }
  }
}
