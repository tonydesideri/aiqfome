import { ClientRepository } from 'src/domain/application/repositories/client-repository.contract'
import { Client } from 'src/domain/enterprise/client.entity'

export class InMemoryClientRepositoryImpl implements ClientRepository {
  public items: Client[] = [];

  async create(client: Client): Promise<void> {
    this.items.push(client);
  }

  async save(client: Client): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.toValue() === client.id.toValue(),
    );
    if (index !== -1) {
      this.items[index] = client;
    } 
  }

  async findById(id: string): Promise<Client | null> {
    const item = this.items.find((item) => item.id.toValue() === id);
    return item ?? null;
  }

  async findAll(): Promise<Client[]> {
    return this.items;
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((item) => item.id.toValue() !== id);
  }

  async findByEmail(email: string): Promise<Client | null> {
    const client = this.items.find((item) => item.email === email);
    return client ?? null;
  }
} 