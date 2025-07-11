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

describe('Update client e2e', () => {
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

  test('[PUT] /clients/:id - should update a client', async () => {
    // Cria um cliente primeiro
    const client = await clientFactory.makePrismaClient({
      name: 'Original Name',
      email: 'original@email.com',
    })

    const response = await request(app.getHttpServer())
      .put(`/clients/${client.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Updated Name',
        email: 'updated@email.com',
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.client).toBeTruthy()
    expect(response.body.client.id).toBe(client.id.toString())
    expect(response.body.client.name).toBe('Updated Name')
    expect(response.body.client.email).toBe('updated@email.com')

    // Verifica se foi atualizado no banco
    const clientOnDatabase = await prisma.client.findUnique({
      where: { id: client.id.toString() },
    })
    expect(clientOnDatabase?.name).toBe('Updated Name')
    expect(clientOnDatabase?.email).toBe('updated@email.com')
  })

  test('[PUT] /clients/:id - should return 404 for non-existent client', async () => {
    const response = await request(app.getHttpServer())
      .put('/clients/non-existent-id')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Updated Name',
        email: 'updated@email.com',
      })

    expect(response.statusCode).toBe(404)
  })

  test('[PUT] /clients/:id - should return 409 for duplicate email', async () => {
    // Cria dois clientes
    const _client1 = await clientFactory.makePrismaClient({
      name: 'Client 1',
      email: 'client1@email.com',
    })
    const client2 = await clientFactory.makePrismaClient({
      name: 'Client 2',
      email: 'client2@email.com',
    })

    // Tenta atualizar client2 com o email de client1
    const response = await request(app.getHttpServer())
      .put(`/clients/${client2.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Updated Name',
        email: 'client1@email.com', // Email já existe
      })

    expect(response.statusCode).toBe(409)
  })
})
