import { ERROR_TYPES } from 'src/core/src/errors'
import { makeFavorite } from 'test/factories/make-favorite.factory'
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
      inMemory.ProductRepository
    )
  })

  it('should add a favorite successfully', async () => {
    const product = makeProduct()
    inMemory.ProductRepository.items.push(product)

    const result = await sut.execute({
      clientId: 'client-1',
      productId: product.id.toString(),
    })

    expect(result.isSuccess()).toBe(true)
    if (result.isSuccess()) {
      expect(result.value.favorite.clientId).toBe('client-1')
      expect(result.value.favorite.productId).toBe(product.id.toString())
    }
  })

  it('should not allow adding duplicate favorite', async () => {
    const product = makeProduct()
    inMemory.ProductRepository.items.push(product)

    const existingFavorite = makeFavorite({
      clientId: 'client-1',
      productId: product.id.toString(),
    })
    inMemory.FavoriteRepository.items.push(existingFavorite)

    const result = await sut.execute({
      clientId: 'client-1',
      productId: product.id.toString(),
    })

    expect(result.isFailure()).toBe(true)
    if (result.isFailure()) {
      expect(result.value.errorType).toBe(ERROR_TYPES.RESOURCE_EXISTS)
    }
  })

  it('should not allow adding favorite for non-existent product', async () => {
    const result = await sut.execute({
      clientId: 'client-1',
      productId: 'non-existent-id',
    })

    expect(result.isFailure()).toBe(true)
    if (result.isFailure()) {
      expect(result.value.errorType).toBe(ERROR_TYPES.RESOURCE_NOT_FOUND)
    }
  })
})
