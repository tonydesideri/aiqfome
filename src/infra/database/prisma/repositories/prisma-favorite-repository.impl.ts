import { Injectable } from '@nestjs/common'
import { FavoriteRepository } from 'src/domain/application/repositories/favorite-repository.contract'
import { Favorite } from 'src/domain/enterprise/favorite.entity'
import { PrismaFavoriteMapper } from '../mappers/prisma-favorite.mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaFavoriteRepositoryImpl implements FavoriteRepository {
  constructor(private prisma: PrismaService) {}

  async create(favorite: Favorite): Promise<void> {
    const data = PrismaFavoriteMapper.toPrisma(favorite)
    await this.prisma.favorite.create({ data })
  }

  async findByClientAndProduct(
    clientId: string,
    productId: string
  ): Promise<Favorite | null> {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        clientId_productId: {
          clientId,
          productId,
        },
      },
    })

    if (!favorite) return null

    return PrismaFavoriteMapper.toDomain(favorite)
  }

  async findByClient(clientId: string): Promise<Favorite[]> {
    const favorites = await this.prisma.favorite.findMany({
      where: { clientId },
    })

    return favorites.map(PrismaFavoriteMapper.toDomain)
  }

  async delete(clientId: string, productId: string): Promise<void> {
    await this.prisma.favorite.delete({
      where: {
        clientId_productId: {
          clientId,
          productId,
        },
      },
    })
  }
}
