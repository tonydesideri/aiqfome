import { Prisma, Client as PrismaClient } from '@prisma/client'
import { UniqueEntityID } from 'src/core/src/entities'
import { Client } from 'src/domain/enterprise/client.entity'

export class PrismaClientMapper {
  static toDomain(raw: PrismaClient): Client {
    return Client.instance(
      {
        name: raw.name,
        email: raw.email,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(client: Client): Prisma.ClientUncheckedCreateInput {
    return {
      id: client.id.toValue(),
      name: client.name,
      email: client.email,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    }
  }
}
