import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { BcryptHasherImpl } from 'src/infra/cryptography/bcrypt-hasher.impl'
import { DatabaseModule } from 'src/infra/database/database.module'
import { PrismaService } from 'src/infra/database/prisma/prisma.service'
import request from 'supertest'
import { UserFactory } from 'test/factories/make-user.factory'

describe('Create client e2e', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let prisma: PrismaService
  let hasher: BcryptHasherImpl
  let jwt: JwtService
  let accessToken: string

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, BcryptHasherImpl],
    }).compile()

    app = moduleRef.createNestApplication()
    userFactory = moduleRef.get(UserFactory)
    prisma = moduleRef.get(PrismaService)
    hasher = moduleRef.get(BcryptHasherImpl)
    jwt = moduleRef.get(JwtService)

    await app.init()

    // Cria usuário e gera token JWT
    const user = await userFactory.makePrismaUser({
      password: await hasher.hash('admin123'),
    })
    accessToken = jwt.sign({ sub: user.id.toValue() })
  })

  test('[POST] /clients - should create a client', async () => {
    const response = await request(app.getHttpServer())
      .post('/clients')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Client Test',
        email: 'client@email.com',
      })

    expect(response.statusCode).toBe(201)
    expect(response.body.client).toBeTruthy()
    expect(response.body.client.name).toBe('Client Test')
    expect(response.body.client.email).toBe('client@email.com')

    const clientOnDatabase = await prisma.client.findUnique({
      where: { email: 'client@email.com' },
    })
    expect(clientOnDatabase).toBeTruthy()
  })
})
