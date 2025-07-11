import { InMemoryUserRepositoryImpl } from "test/repositories/in-memory-user-repository";
import { InMemoryClientRepositoryImpl } from "test/repositories/in-memory-client-repository";
import { InMemoryFavoriteRepositoryImpl } from "test/repositories/in-memory-favorite-repository";
import { InMemoryProductRepositoryImpl } from "test/repositories/in-memory-product-repository";

export interface InMemoryRepositoriesProps {
  UserRepository: InMemoryUserRepositoryImpl;
  ClientRepository: InMemoryClientRepositoryImpl;
  FavoriteRepository: InMemoryFavoriteRepositoryImpl;
  ProductRepository: InMemoryProductRepositoryImpl;
}

export function makeInMemoryRepositories(): InMemoryRepositoriesProps {
  const inMemoryUserRepositoryImpl = new InMemoryUserRepositoryImpl();
  const inMemoryClientRepositoryImpl = new InMemoryClientRepositoryImpl();
  const inMemoryFavoriteRepositoryImpl = new InMemoryFavoriteRepositoryImpl();
  const inMemoryProductRepositoryImpl = new InMemoryProductRepositoryImpl();

  return {
    UserRepository: inMemoryUserRepositoryImpl,
    ClientRepository: inMemoryClientRepositoryImpl,
    FavoriteRepository: inMemoryFavoriteRepositoryImpl,
    ProductRepository: inMemoryProductRepositoryImpl,
  };
}
