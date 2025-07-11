import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { BcryptHasherImpl } from 'src/infra/cryptography/bcrypt-hasher.impl'
import { DatabaseModule } from 'src/infra/database/database.module'
import { PrismaService } from 'src/infra/database/prisma/prisma.service'
import request from 'supertest'
import { UserFactory } from 'test/factories/make-user.factory'

describe('Sign in e2e', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let prisma: PrismaService
  let hasher: BcryptHasherImpl

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, BcryptHasherImpl],
    }).compile()

    app = moduleRef.createNestApplication()

    userFactory = moduleRef.get(UserFactory)
    prisma = moduleRef.get(PrismaService)
    hasher = moduleRef.get(BcryptHasherImpl)

    await app.init()
  })

  test('[POST] /auth/sign-in', async () => {
    const user = await userFactory.makePrismaUser({
      password: await hasher.hash('admin123'),
    })

    const response = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({
        email: user.email,
        password: 'admin123',
      })

    expect(response.statusCode).toBe(200)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        id: user.id.toValue(),
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})
