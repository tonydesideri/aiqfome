import { AggregateRoot, UniqueEntityID } from 'src/core/src/entities'
import { Optional } from 'src/core/src/types'

export interface FavoriteProps {
  clientId: string
  productId: string
  createdAt: Date
}

export class Favorite extends AggregateRoot<FavoriteProps> {
  static instance(
    props: Optional<FavoriteProps, 'createdAt'>,
    id?: UniqueEntityID
  ) {
    const now = new Date()
    const favorite = new Favorite(
      {
        ...props,
        createdAt: props.createdAt ?? now,
      },
      id
    )
    return favorite
  }

  get clientId() {
    return this.props.clientId
  }

  get productId() {
    return this.props.productId
  }

  get createdAt() {
    return this.props.createdAt
  }
}
