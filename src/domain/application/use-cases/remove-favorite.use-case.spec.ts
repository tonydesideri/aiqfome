import { ERROR_TYPES } from 'src/core/src/errors'
import { makeFavorite } from 'test/factories/make-favorite.factory'
import { makeInMemoryRepositories } from 'test/factories/make-in-memory-repositories.factory'
import { beforeEach, describe, expect, it } from 'vitest'
import { RemoveFavoriteUseCase } from './remove-favorite.use-case'

describe('RemoveFavoriteUseCase', () => {
  let sut: RemoveFavoriteUseCase
  let inMemory: ReturnType<typeof makeInMemoryRepositories>

  beforeEach(() => {
    inMemory = makeInMemoryRepositories()
    sut = new RemoveFavoriteUseCase(inMemory.FavoriteRepository)
  })

  it('should remove a favorite successfully', async () => {
    const favorite = makeFavorite({
      clientId: 'client-1',
      productId: 'product-1',
    })
    inMemory.FavoriteRepository.items.push(favorite)

    const result = await sut.execute({
      clientId: 'client-1',
      productId: 'product-1',
    })

    expect(result.isSuccess()).toBe(true)
    expect(inMemory.FavoriteRepository.items).toHaveLength(0)
  })

  it('should return failure if favorite does not exist', async () => {
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
