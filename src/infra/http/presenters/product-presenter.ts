import { Product } from 'src/domain/enterprise/product.entity'

export class ProductPresenter {
  static toHTTP(product: Product) {
    return {
      id: product.id.toString(),
      title: product.title,
      price: product.price,
      image: product.image,
      rating: product.rating,
    }
  }
}
