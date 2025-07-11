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

describe('Delete client e2e', () => {
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

  test('[DELETE] /clients/:id - should delete a client', async () => {
    // Cria um cliente primeiro
    const client = await clientFactory.makePrismaClient({
      name: 'Client to Delete',
      email: 'delete@email.com',
    })

    const response = await request(app.getHttpServer())
      .delete(`/clients/${client.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)

    // Verifica se foi removido do banco
    const clientOnDatabase = await prisma.client.findUnique({
      where: { id: client.id.toString() },
    })
    expect(clientOnDatabase).toBeNull()
  })

  test('[DELETE] /clients/:id - should return 404 for non-existent client', async () => {
    const response = await request(app.getHttpServer())
      .delete('/clients/non-existent-id')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(404)
  })
})
