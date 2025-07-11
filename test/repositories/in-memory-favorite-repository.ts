import { FavoriteRepository } from 'src/domain/application/repositories/favorite-repository.contract'
import { Favorite } from 'src/domain/enterprise/favorite.entity'

export class InMemoryFavoriteRepositoryImpl implements FavoriteRepository {
  public items: Favorite[] = [];

  async create(favorite: Favorite): Promise<void> {
    this.items.push(favorite);
  }

  async findByClientAndProduct(clientId: string, productId: string): Promise<Favorite | null> {
    const favorite = this.items.find(
      (item) => item.clientId === clientId && item.productId === productId
    );
    return favorite ?? null;
  }

  async findByClient(clientId: string): Promise<Favorite[]> {
    return this.items.filter((item) => item.clientId === clientId);
  }

  async delete(clientId: string, productId: string): Promise<void> {
    this.items = this.items.filter(
      (item) => !(item.clientId === clientId && item.productId === productId)
    );
  }
} 