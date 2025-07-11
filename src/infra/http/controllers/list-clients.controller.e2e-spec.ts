import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { BcryptHasherImpl } from 'src/infra/cryptography/bcrypt-hasher.impl'
import { DatabaseModule } from 'src/infra/database/database.module'
import { PrismaService } from 'src/infra/database/prisma/prisma.service'
import request from 'supertest'
import { ClientFactory } from 'test/factories/make-client.factory'
import { UserFactory } from 'test/factories/make-user.factory'

describe('List clients e2e', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let clientFactory: ClientFactory
  let prisma: PrismaService
  let hasher: BcryptHasherImpl
  let jwt: JwtService
  let accessToken: string

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, ClientFactory, BcryptHasherImpl],
    }).compile()

    app = moduleRef.createNestApplication()
    userFactory = moduleRef.get(UserFactory)
    clientFactory = moduleRef.get(ClientFactory)
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

  test('[GET] /clients - should list all clients', async () => {
    // Cria alguns clientes primeiro
    const client1 = await clientFactory.makePrismaClient({
      name: 'Client 1',
      email: 'client1@email.com',
    })
    const client2 = await clientFactory.makePrismaClient({
      name: 'Client 2',
      email: 'client2@email.com',
    })

    const response = await request(app.getHttpServer())
      .get('/clients')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.clients).toBeTruthy()
    expect(response.body.clients).toHaveLength(2)
    expect(response.body.clients).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: client1.id.toString(),
          name: 'Client 1',
          email: 'client1@email.com',
        }),
        expect.objectContaining({
          id: client2.id.toString(),
          name: 'Client 2',
          email: 'client2@email.com',
        }),
      ])
    )
  })

  test('[GET] /clients - should return empty array when no clients exist', async () => {
    // Limpa todos os clientes
    await prisma.client.deleteMany()

    const response = await request(app.getHttpServer())
      .get('/clients')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.clients).toEqual([])
  })
})
