import { Entity, UniqueEntityID } from 'src/core/src/entities'

export interface ProductProps {
  title: string
  image: string
  price: number
  rating?: {
    rate: number
    count: number
  }
}

export class Product extends Entity<ProductProps> {
  static instance(props: ProductProps, id?: UniqueEntityID) {
    const product = new Product(props, id)
    return product
  }

  get title() {
    return this.props.title
  }

  get image() {
    return this.props.image
  }

  get price() {
    return this.props.price
  }

  get rating() {
    return this.props.rating
  }
}
