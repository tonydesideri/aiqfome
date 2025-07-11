import { UserRepository } from "src/domain/application/repositories/user-repository.contract";
import { User } from "src/domain/enterprise/user.entity";

export class InMemoryUserRepositoryImpl implements UserRepository {
  public items: User[] = [];

  async create(user: User): Promise<void> {
    this.items.push(user);
  }

  async save(user: User): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.toValue() === user.id.toValue(),
    );

    if (index !== -1) {
      this.items[index] = user;
    }
  }


  async findById(id: string): Promise<User | null> {
    const item = this.items
      .find((item) => item.id.toValue() === id);

    if (!item) {
      return null;
    }

    return item;
  }


  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find(
      (item) =>
        item.email === email,
    );

    if (!user) {
      return null;
    }

    return user;
  }
}
