import { Client } from '../../enterprise/client.entity'

export abstract class ClientRepository {
  abstract create(client: Client): Promise<void>
  abstract save(client: Client): Promise<void>
  abstract findById(id: string): Promise<Client | null>
  abstract findAll(): Promise<Client[]>
  abstract delete(id: string): Promise<void>
  abstract findByEmail(email: string): Promise<Client | null>
}
