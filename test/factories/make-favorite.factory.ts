import { UniqueEntityID } from 'src/core/src/entities';
import { Favorite, FavoriteProps } from 'src/domain/enterprise/favorite.entity';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { PrismaFavoriteMapper } from 'src/infra/database/prisma/mappers/prisma-favorite.mapper';

export function makeFavorite(
  override: Partial<FavoriteProps> = {},
  id?: UniqueEntityID,
) {
  const favorite = Favorite.instance(
    {
      clientId: faker.string.uuid(),
      productId: faker.string.uuid(),
      ...override,
    },
    id,
  );
  return favorite;
}

@Injectable()
export class FavoriteFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaFavorite(data: Partial<FavoriteProps> = {}, id?: UniqueEntityID) {
    const favorite = makeFavorite(data, id);

    await this.prisma.favorite.create({
      data: PrismaFavoriteMapper.toPrisma(favorite),
    });

    return favorite;
  }
} 