import { UniqueEntityID } from 'src/core/src/entities';
import { Favorite, FavoriteProps } from 'src/domain/enterprise/favorite.entity';
import { faker } from '@faker-js/faker';

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