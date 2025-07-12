import { Prisma, Favorite as PrismaFavorite } from '@prisma/client'
import { UniqueEntityID } from 'src/core/src/entities'
import { Favorite } from 'src/domain/enterprise/favorite.entity'

export class PrismaFavoriteMapper {
  static toDomain(raw: PrismaFavorite): Favorite {
    return Favorite.instance(
      {
        clientId: raw.clientId,
        productId: raw.productId,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(favorite: Favorite): Prisma.FavoriteUncheckedCreateInput {
    return {
      id: favorite.id.toValue(),
      clientId: favorite.clientId,
      productId: favorite.productId,
      createdAt: favorite.createdAt,
    }
  }
}
