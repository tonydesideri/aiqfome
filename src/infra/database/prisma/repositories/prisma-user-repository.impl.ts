import { Injectable } from '@nestjs/common'
import { UserRepository } from 'src/domain/application/repositories/user-repository.contract'
import { User } from 'src/domain/enterprise/user.entity'
import { PrismaUserMapper } from '../mappers/prisma-user.mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaUserRepositoryImpl implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }

  async save(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user)

    await this.prisma.user.update({
      where: {
        id: user.id.toValue(),
      },
      data,
    })
  }
}
