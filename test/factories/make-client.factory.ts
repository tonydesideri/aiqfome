import { UniqueEntityID } from 'src/core/src/entities';
import { Client, ClientProps } from 'src/domain/enterprise/client.entity';
import { faker } from '@faker-js/faker';

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