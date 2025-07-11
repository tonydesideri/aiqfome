import { InMemoryUserRepositoryImpl } from "test/repositories/in-memory-user-repository";

export interface InMemoryRepositoriesProps {
  UserRepository: InMemoryUserRepositoryImpl;
}

export function makeInMemoryRepositories(): InMemoryRepositoriesProps {
  const inMemoryUserRepositoryImpl = new InMemoryUserRepositoryImpl();

  return {
    UserRepository: inMemoryUserRepositoryImpl,
  };
}
