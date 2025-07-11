import { UniqueEntityID } from 'src/core/src/entities';
import { Client, ClientProps } from 'src/domain/enterprise/client.entity';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { PrismaClientMapper } from 'src/infra/database/prisma/mappers/prisma-client.mapper';

export function makeClient(
  override: Partial<ClientProps> = {},
  id?: UniqueEntityID,
) {
  const client = Client.instance(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      ...override,
    },
    id,
  );
  return client;
}

@Injectable()
export class ClientFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaClient(data: Partial<ClientProps> = {}, id?: UniqueEntityID) {
    const client = makeClient(data, id);

    await this.prisma.client.create({
      data: PrismaClientMapper.toPrisma(client),
    });

    return client;
  }
} 