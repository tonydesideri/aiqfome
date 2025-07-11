import { AggregateRoot, UniqueEntityID } from 'src/core/src/entities'
import { Optional } from 'src/core/src/types'

export interface UserProps {
  email: string
  password: string
  createdAt: Date
}

export class User extends AggregateRoot<UserProps> {
  static instance(
    props: Optional<UserProps, 'createdAt'>,
    id?: UniqueEntityID
  ) {
    const user = new User(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )

    return user
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  get createdAt() {
    return this.props.createdAt
  }
}
