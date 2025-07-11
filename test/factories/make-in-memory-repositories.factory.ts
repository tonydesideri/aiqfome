import { InMemoryUserRepositoryImpl } from "test/repositories/in-memory-user-repository";
import { InMemoryClientRepositoryImpl } from "test/repositories/in-memory-client-repository";

export interface InMemoryRepositoriesProps {
  UserRepository: InMemoryUserRepositoryImpl;
  ClientRepository: InMemoryClientRepositoryImpl;
}

export function makeInMemoryRepositories(): InMemoryRepositoriesProps {
  const inMemoryUserRepositoryImpl = new InMemoryUserRepositoryImpl();
  const inMemoryClientRepositoryImpl = new InMemoryClientRepositoryImpl();

  return {
    UserRepository: inMemoryUserRepositoryImpl,
    ClientRepository: inMemoryClientRepositoryImpl,
  };
}
