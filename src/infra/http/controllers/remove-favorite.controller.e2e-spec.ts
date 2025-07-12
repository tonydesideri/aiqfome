import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { BcryptHasherImpl } from 'src/infra/cryptography/bcrypt-hasher.impl'
import { DatabaseModule } from 'src/infra/database/database.module'
import { PrismaService } from 'src/infra/database/prisma/prisma.service'
import { FakeStoreApiService } from 'src/infra/external/fakestore-api.service'
import request from 'supertest'
import { ClientFactory } from 'test/factories/make-client.factory'
import { FavoriteFactory } from 'test/factories/make-favorite.factory'
import { UserFactory } from 'test/factories/make-user.factory'
import { beforeAll, beforeEach, describe, expect, test } from 'vitest'

describe('Remove favorite e2e', () => {
  let app: INestApplication
  let clientFactory: ClientFactory
  let userFactory: UserFactory
  let favoriteFactory: FavoriteFactory
  let prisma: PrismaService
  let hasher: BcryptHasherImpl
  let jwt: JwtService
  let _fakeStoreApiService: FakeStoreApiService
  let accessToken: string

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        ClientFactory,
        UserFactory,
        FavoriteFactory,
        BcryptHasherImpl,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    clientFactory = moduleRef.get(ClientFactory)
    userFactory = moduleRef.get(UserFactory)
    favoriteFactory = moduleRef.get(FavoriteFactory)
    prisma = moduleRef.get(PrismaService)
    hasher = moduleRef.get(BcryptHasherImpl)
    jwt = moduleRef.get(JwtService)
    _fakeStoreApiService = moduleRef.get(FakeStoreApiService)

    await app.init()

    // Cria usuário e gera token JWT
    const user = await userFactory.makePrismaUser({
      password: await hasher.hash('admin123'),
    })
    accessToken = jwt.sign({ sub: user.id.toValue() })
  })

  beforeEach(async () => {
    // Limpa o banco antes de cada teste
    await prisma.favorite.deleteMany()
    await prisma.client.deleteMany()
  })

  test('[DELETE] /favorites/:productId - should remove a favorite', async () => {
    // Cria um cliente
    const client = await clientFactory.makePrismaClient({
      name: 'Test Client',
      email: 'test@email.com',
    })

    // Cria um favorito usando o factory
    await favoriteFactory.makePrismaFavorite({
      clientId: client.id.toString(),
      productId: '1',
    })

    // Verifica se foi criado no banco
    const favoriteBeforeDelete = await prisma.favorite.findFirst({
      where: {
        clientId: client.id.toString(),
        productId: '1',
      },
    })
    expect(favoriteBeforeDelete).toBeTruthy()

    // Remove o favorito
    const response = await request(app.getHttpServer())
      .delete('/favorites/1')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        clientId: client.id.toString(),
      })

    expect(response.statusCode).toBe(204)

    // Verifica se foi removido do banco
    const favoriteAfterDelete = await prisma.favorite.findFirst({
      where: {
        clientId: client.id.toString(),
        productId: '1',
      },
    })
    expect(favoriteAfterDelete).toBeNull()
  })

  test('[DELETE] /favorites/:productId - should return 404 for non-existent favorite', async () => {
    // Cria um cliente
    const client = await clientFactory.makePrismaClient({
      name: 'Test Client',
      email: 'test@email.com',
    })

    // Tenta remover um favorito que não existe
    const response = await request(app.getHttpServer())
      .delete('/favorites/999999')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        clientId: client.id.toString(),
      })

    expect(response.statusCode).toBe(404)
    expect(response.body.message[0]).toBe('Favorito não encontrado')
  })

  test('[DELETE] /favorites/:productId - should return 400 for missing clientId', async () => {
    const response = await request(app.getHttpServer())
      .delete('/favorites/1')
      .set('Authorization', `Bearer ${accessToken}`)
    // Não envia clientId no query

    expect(response.statusCode).toBe(400)
    expect(response.body.message[0]).toBe('clientId é obrigatório')
  })
})
