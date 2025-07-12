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
import { makeProduct } from 'test/factories/make-product.factory'
import { UserFactory } from 'test/factories/make-user.factory'
import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'

describe('Add favorite e2e', () => {
  let app: INestApplication
  let clientFactory: ClientFactory
  let userFactory: UserFactory
  let prisma: PrismaService
  let hasher: BcryptHasherImpl
  let jwt: JwtService
  let fakeStoreApiService: FakeStoreApiService
  let accessToken: string

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ClientFactory, UserFactory, BcryptHasherImpl],
    }).compile()

    app = moduleRef.createNestApplication()
    clientFactory = moduleRef.get(ClientFactory)
    userFactory = moduleRef.get(UserFactory)
    prisma = moduleRef.get(PrismaService)
    hasher = moduleRef.get(BcryptHasherImpl)
    jwt = moduleRef.get(JwtService)
    fakeStoreApiService = moduleRef.get(FakeStoreApiService)

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

  test('[POST] /favorites - should add a favorite', async () => {
    // Cria um cliente
    const client = await clientFactory.makePrismaClient({
      name: 'Test Client',
      email: 'test@email.com',
    })

    // Mock do produto da API externa
    const mockProduct = makeProduct({
      title: 'Test Product',
      price: 99.99,
      image: 'https://test.com/image.jpg',
      rating: { rate: 4.5, count: 100 },
    })

    vi.spyOn(fakeStoreApiService, 'findById').mockResolvedValue(mockProduct)

    const response = await request(app.getHttpServer())
      .post('/favorites')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        clientId: client.id.toString(),
        productId: '1',
      })

    expect(response.statusCode).toBe(201)
    expect(response.body.favorite).toBeTruthy()
    expect(response.body.favorite.clientId).toBe(client.id.toString())
    expect(response.body.favorite.productId).toBe('1')

    // Verifica se foi criado no banco
    const favoriteOnDatabase = await prisma.favorite.findFirst({
      where: {
        clientId: client.id.toString(),
        productId: '1',
      },
    })
    expect(favoriteOnDatabase).toBeTruthy()
  })

  test('[POST] /favorites - should return 404 for non-existent product', async () => {
    // Cria um cliente
    const client = await clientFactory.makePrismaClient({
      name: 'Test Client',
      email: 'test@email.com',
    })

    // Mock do produto não encontrado
    vi.spyOn(fakeStoreApiService, 'findById').mockResolvedValue(null)

    const response = await request(app.getHttpServer())
      .post('/favorites')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        clientId: client.id.toString(),
        productId: '999999',
      })

    expect(response.statusCode).toBe(404)
    expect(response.body.message[0]).toBe('Produto não encontrado')
  })

  test('[POST] /favorites - should return 409 for duplicate favorite', async () => {
    // Cria um cliente
    const client = await clientFactory.makePrismaClient({
      name: 'Test Client',
      email: 'test@email.com',
    })

    // Mock do produto da API externa
    const mockProduct = makeProduct({
      title: 'Test Product',
      price: 99.99,
      image: 'https://test.com/image.jpg',
      rating: { rate: 4.5, count: 100 },
    })

    vi.spyOn(fakeStoreApiService, 'findById').mockResolvedValue(mockProduct)

    // Adiciona o favorito pela primeira vez
    await request(app.getHttpServer())
      .post('/favorites')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        clientId: client.id.toString(),
        productId: '1',
      })

    // Tenta adicionar o mesmo favorito novamente
    const response = await request(app.getHttpServer())
      .post('/favorites')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        clientId: client.id.toString(),
        productId: '1',
      })

    expect(response.statusCode).toBe(409)
    expect(response.body.message[0]).toBe('Produto já foi favoritado')
  })
})
