import { UniqueEntityID } from "src/core/src/entities";
import { User, UserProps } from "src/domain/enterprise/user.entity";
import { faker } from '@faker-js/faker';
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/infra/database/prisma/prisma.service";
import { PrismaUserMapper } from "src/infra/database/prisma/mappers/prisma-user.mapper";

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID,
) {
  const user = User.instance(
    {
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  );

  return user;
}

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaUser(data: Partial<UserProps> = {}, id?: UniqueEntityID) {
    const user = makeUser(data, id);

    await this.prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    });

    return user;
  }
}
