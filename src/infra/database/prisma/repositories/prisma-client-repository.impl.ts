import { Injectable } from '@nestjs/common'
import { ClientRepository } from 'src/domain/application/repositories/client-repository.contract'
import { Client } from 'src/domain/enterprise/client.entity'
import { PrismaClientMapper } from '../mappers/prisma-client.mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaClientRepositoryImpl implements ClientRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({
      where: { email },
    })

    if (!client) return null

    return PrismaClientMapper.toDomain(client)
  }

  async findById(id: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({
      where: { id },
    })

    if (!client) return null

    return PrismaClientMapper.toDomain(client)
  }

  async findAll(): Promise<Client[]> {
    const clients = await this.prisma.client.findMany()
    return clients.map(PrismaClientMapper.toDomain)
  }

  async create(client: Client): Promise<void> {
    const data = PrismaClientMapper.toPrisma(client)
    await this.prisma.client.create({ data })
  }

  async save(client: Client): Promise<void> {
    const data = PrismaClientMapper.toPrisma(client)
    await this.prisma.client.update({
      where: { id: client.id.toValue() },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.client.delete({ where: { id } })
  }
}
