import { ProductRepository } from 'src/domain/application/repositories/product-repository.contract'
import { Product } from 'src/domain/enterprise/product.entity'

export class InMemoryProductRepositoryImpl implements ProductRepository {
  public items: Product[] = [];

  async findById(id: string): Promise<Product | null> {
    const product = this.items.find((item) => item.id.toString() === id);
    return product ?? null;
  }

  async findAll(): Promise<Product[]> {
    return this.items;
  }
} 