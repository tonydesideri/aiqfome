import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { UniqueEntityID } from 'src/core/src/entities'
import { ProductRepository } from 'src/domain/application/repositories/product-repository.contract'
import { BcryptHasherImpl } from 'src/infra/cryptography/bcrypt-hasher.impl'
import { DatabaseModule } from 'src/infra/database/database.module'
import { PrismaService } from 'src/infra/database/prisma/prisma.service'
import request from 'supertest'
import { ClientFactory } from 'test/factories/make-client.factory'
import { FavoriteFactory } from 'test/factories/make-favorite.factory'
import { makeProduct } from 'test/factories/make-product.factory'
import { UserFactory } from 'test/factories/make-user.factory'
import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'

describe('List favorites e2e', () => {
  let app: INestApplication
  let clientFactory: ClientFactory
  let favoriteFactory: FavoriteFactory
  let userFactory: UserFactory
  let prisma: PrismaService
  let hasher: BcryptHasherImpl
  let jwt: JwtService
  let productRepositoryMock: { findById: ReturnType<typeof vi.fn> }
  let accessToken: string

  beforeAll(async () => {
    productRepositoryMock = {
      findById: vi.fn(),
    }

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        ClientFactory,
        FavoriteFactory,
        UserFactory,
        BcryptHasherImpl,
      ],
    })
      .overrideProvider(ProductRepository)
      .useValue(productRepositoryMock)
      .compile()

    app = moduleRef.createNestApplication()
    clientFactory = moduleRef.get(ClientFactory)
    favoriteFactory = moduleRef.get(FavoriteFactory)
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

  beforeEach(async () => {
    // Limpa o banco antes de cada teste
    await prisma.favorite.deleteMany()
    await prisma.client.deleteMany()

    // Limpa o mock antes de cada teste
    productRepositoryMock.findById.mockClear()
  })

  test('[GET] /favorites - should list favorites for a client', async () => {
    // Cria um cliente
    const client = await clientFactory.makePrismaClient({
      name: 'Test Client',
      email: 'test@email.com',
    })

    // Mock dos produtos da API externa
    const mockProduct1 = makeProduct(
      {
        title: 'Product 1',
        price: 99.99,
        image: 'https://test.com/image1.jpg',
        rating: { rate: 4.5, count: 100 },
      },
      new UniqueEntityID('1')
    )

    const mockProduct2 = makeProduct(
      {
        title: 'Product 2',
        price: 149.99,
        image: 'https://test.com/image2.jpg',
        rating: { rate: 4.0, count: 50 },
      },
      new UniqueEntityID('2')
    )

    // Mock mais específico para cada productId
    productRepositoryMock.findById.mockImplementation((productId: string) => {
      if (productId === '1') {
        return Promise.resolve(mockProduct1)
      }
      if (productId === '2') {
        return Promise.resolve(mockProduct2)
      }
      return Promise.resolve(null)
    })

    // Cria favoritos usando a factory
    await favoriteFactory.makePrismaFavorite({
      clientId: client.id.toString(),
      productId: '1',
    })

    await favoriteFactory.makePrismaFavorite({
      clientId: client.id.toString(),
      productId: '2',
    })

    const response = await request(app.getHttpServer())
      .get('/favorites')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ clientId: client.id.toString() })

    expect(response.statusCode).toBe(200)
    expect(response.body.favorites).toBeTruthy()
    expect(response.body.favorites).toHaveLength(2)

    // Verifica o primeiro favorito
    expect(response.body.favorites[0].clientId).toBe(client.id.toString())
    expect(response.body.favorites[0].productId).toBe('1')
    expect(response.body.favorites[0].product).toBeTruthy()
    expect(response.body.favorites[0].product.title).toBe('Product 1')
    expect(response.body.favorites[0].product.price).toBe(99.99)

    // Verifica o segundo favorito
    expect(response.body.favorites[1].clientId).toBe(client.id.toString())
    expect(response.body.favorites[1].productId).toBe('2')
    expect(response.body.favorites[1].product).toBeTruthy()
    expect(response.body.favorites[1].product.title).toBe('Product 2')
    expect(response.body.favorites[1].product.price).toBe(149.99)
  })

  test('[GET] /favorites - should return empty array for client without favorites', async () => {
    // Cria um cliente sem favoritos
    const client = await clientFactory.makePrismaClient({
      name: 'Test Client',
      email: 'test@email.com',
    })

    const response = await request(app.getHttpServer())
      .get('/favorites')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ clientId: client.id.toString() })

    expect(response.statusCode).toBe(200)
    expect(response.body.favorites).toBeTruthy()
    expect(response.body.favorites).toHaveLength(0)
  })

  test('[GET] /favorites - should return empty array for non-existent client', async () => {
    const response = await request(app.getHttpServer())
      .get('/favorites')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ clientId: 'non-existent-client-id' })

    expect(response.statusCode).toBe(200)
    expect(response.body.favorites).toBeTruthy()
    expect(response.body.favorites).toHaveLength(0)
  })

  test('[GET] /favorites - should handle products not found in external API', async () => {
    // Cria um cliente
    const client = await clientFactory.makePrismaClient({
      name: 'Test Client',
      email: 'test@email.com',
    })

    // Mock de produto não encontrado na API externa
    productRepositoryMock.findById.mockResolvedValue(null)

    // Cria favorito com produto que não existe na API externa
    await favoriteFactory.makePrismaFavorite({
      clientId: client.id.toString(),
      productId: '999999',
    })

    const response = await request(app.getHttpServer())
      .get('/favorites')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ clientId: client.id.toString() })

    expect(response.statusCode).toBe(200)
    expect(response.body.favorites).toBeTruthy()
    expect(response.body.favorites).toHaveLength(1)
    expect(response.body.favorites[0].clientId).toBe(client.id.toString())
    expect(response.body.favorites[0].productId).toBe('999999')
    expect(response.body.favorites[0].product).toBeNull()
  })
})
