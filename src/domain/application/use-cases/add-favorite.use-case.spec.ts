import { ERROR_TYPES } from 'src/core/src/errors'
import { makeClient } from 'test/factories/make-client.factory'
import {
  InMemoryRepositoriesProps,
  makeInMemoryRepositories,
} from 'test/factories/make-in-memory-repositories.factory'
import { makeProduct } from 'test/factories/make-product.factory'
import { beforeEach, describe, expect, it } from 'vitest'
import { AddFavoriteUseCase } from './add-favorite.use-case'

describe('AddFavoriteUseCase', () => {
  let sut: AddFavoriteUseCase
  let inMemory: InMemoryRepositoriesProps

  beforeEach(() => {
    inMemory = makeInMemoryRepositories()
    sut = new AddFavoriteUseCase(
      inMemory.FavoriteRepository,
      inMemory.ProductRepository,
      inMemory.ClientRepository
    )
  })

  it('should add a favorite successfully', async () => {
    const client = makeClient()
    const product = makeProduct()

    await inMemory.ClientRepository.create(client)
    inMemory.ProductRepository.items.push(product)

    const result = await sut.execute({
      clientId: client.id.toString(),
      productId: product.id.toString(),
    })

    expect(result.isSuccess()).toBe(true)
    if (result.isSuccess()) {
      expect(result.value.favorite.clientId).toBe(client.id.toString())
      expect(result.value.favorite.productId).toBe(product.id.toString())
    }
  })

  it('should return failure if client does not exist', async () => {
    const product = makeProduct()
    inMemory.ProductRepository.items.push(product)

    const result = await sut.execute({
      clientId: 'non-existent-client-id',
      productId: product.id.toString(),
    })

    expect(result.isFailure()).toBe(true)
    if (result.isFailure()) {
      expect(result.value.errorType).toBe(ERROR_TYPES.RESOURCE_NOT_FOUND)
      expect(result.value.message).toBe('Cliente não encontrado')
    }
  })

  it('should return failure if product does not exist', async () => {
    const client = makeClient()
    await inMemory.ClientRepository.create(client)

    const result = await sut.execute({
      clientId: client.id.toString(),
      productId: 'non-existent-product-id',
    })

    expect(result.isFailure()).toBe(true)
    if (result.isFailure()) {
      expect(result.value.errorType).toBe(ERROR_TYPES.RESOURCE_NOT_FOUND)
      expect(result.value.message).toBe('Produto não encontrado')
    }
  })

  it('should return failure if favorite already exists', async () => {
    const client = makeClient()
    const product = makeProduct()

    await inMemory.ClientRepository.create(client)
    inMemory.ProductRepository.items.push(product)

    // Adiciona o primeiro favorito
    await sut.execute({
      clientId: client.id.toString(),
      productId: product.id.toString(),
    })

    // Tenta adicionar o mesmo favorito novamente
    const result = await sut.execute({
      clientId: client.id.toString(),
      productId: product.id.toString(),
    })

    expect(result.isFailure()).toBe(true)
    if (result.isFailure()) {
      expect(result.value.errorType).toBe(ERROR_TYPES.RESOURCE_EXISTS)
      expect(result.value.message).toBe('Produto já foi favoritado')
    }
  })
})
