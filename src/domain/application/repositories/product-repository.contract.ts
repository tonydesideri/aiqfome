import { Product } from '../../enterprise/product.entity'

export abstract class ProductRepository {
  abstract findById(id: string): Promise<Product | null>
  abstract findAll(): Promise<Product[]>
}
