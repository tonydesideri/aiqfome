import { UniqueEntityID } from 'src/core/src/entities'
import { Product } from 'src/domain/enterprise/product.entity'

interface FakeStoreProduct {
  id: number
  title: string
  image: string
  price: number
  rating: {
    rate: number
    count: number
  }
}

export class FakeStoreProductMapper {
  static toDomain(raw: FakeStoreProduct): Product {
    return Product.instance(
      {
        title: raw.title,
        image: raw.image,
        price: raw.price,
        rating: raw.rating,
      },
      new UniqueEntityID(raw.id.toString())
    )
  }
}
