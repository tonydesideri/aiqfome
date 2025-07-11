import { AggregateRoot, UniqueEntityID } from 'src/core/src/entities'
import { Optional } from 'src/core/src/types'

export interface ClientProps {
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export class Client extends AggregateRoot<ClientProps> {
  static instance(
    props: Optional<ClientProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID
  ) {
    const now = new Date()
    const client = new Client(
      {
        ...props,
        createdAt: props.createdAt ?? now,
        updatedAt: props.updatedAt ?? now,
      },
      id
    )
    return client
  }

  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  public updateName(name: string) {
    this.props.name = name
    this.props.updatedAt = new Date()
  }

  public updateEmail(email: string) {
    this.props.email = email
    this.props.updatedAt = new Date()
  }
}
