import { Client } from 'src/domain/enterprise/client.entity'

export class ClientPresenter {
  static toHTTP(client: Client) {
    return {
      id: client.id.toString(),
      name: client.name,
      email: client.email,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    }
  }
}
