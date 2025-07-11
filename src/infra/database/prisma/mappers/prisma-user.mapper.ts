import { Prisma, User as PrismaUser } from '@prisma/client'
import { UniqueEntityID } from 'src/core/src/entities'
import { User } from 'src/domain/enterprise/user.entity'

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.instance(
      {
        email: raw.email,
        password: raw.password,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toValue(),
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
    }
  }
}
