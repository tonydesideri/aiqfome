import { Injectable } from '@nestjs/common'
import { ProductRepository } from 'src/domain/application/repositories/product-repository.contract'
import { Product } from 'src/domain/enterprise/product.entity'
import { FakeStoreProductMapper } from './mappers/fakestore-product.mapper'

@Injectable()
export class FakeStoreApiService implements ProductRepository {
  private readonly baseUrl = 'https://fakestoreapi.com'

  async findById(id: string): Promise<Product | null> {
    try {
      const response = await fetch(`${this.baseUrl}/products/${id}`)

      if (!response.ok) {
        return null
      }

      const data = await response.json()
      return FakeStoreProductMapper.toDomain(data)
    } catch (_error) {
      return null
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseUrl}/products`)

      if (!response.ok) {
        return []
      }

      const data = await response.json()
      return data.map(FakeStoreProductMapper.toDomain)
    } catch (_error) {
      return []
    }
  }
}
