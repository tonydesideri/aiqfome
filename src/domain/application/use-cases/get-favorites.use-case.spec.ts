import { makeFavorite } from 'test/factories/make-favorite.factory'
import { makeInMemoryRepositories } from 'test/factories/make-in-memory-repositories.factory'
import { makeProduct } from 'test/factories/make-product.factory'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetFavoritesUseCase } from './get-favorites.use-case'

describe('GetFavoritesUseCase', () => {
  let sut: GetFavoritesUseCase
  let inMemory: ReturnType<typeof makeInMemoryRepositories>

  beforeEach(() => {
    inMemory = makeInMemoryRepositories()
    sut = new GetFavoritesUseCase(
      inMemory.FavoriteRepository,
      inMemory.ProductRepository
    )
  })

  it('should return favorites with products', async () => {
    const product1 = makeProduct()
    const product2 = makeProduct()
    inMemory.ProductRepository.items.push(product1, product2)

    const favorite1 = makeFavorite({
      clientId: 'client-1',
      productId: product1.id.toString(),
    })
    const favorite2 = makeFavorite({
      clientId: 'client-1',
      productId: product2.id.toString(),
    })
    inMemory.FavoriteRepository.items.push(favorite1, favorite2)

    const result = await sut.execute({ clientId: 'client-1' })

    expect(result.isSuccess()).toBe(true)
    if (result.isSuccess()) {
      expect(result.value.favorites).toHaveLength(2)
      expect(result.value.favorites[0].favorite.productId).toBe(
        product1.id.toString()
      )
      expect(result.value.favorites[0].product).toBeTruthy()
      expect(result.value.favorites[1].favorite.productId).toBe(
        product2.id.toString()
      )
      expect(result.value.favorites[1].product).toBeTruthy()
    }
  })

  it('should return empty array when no favorites exist', async () => {
    const result = await sut.execute({ clientId: 'client-1' })

    expect(result.isSuccess()).toBe(true)
    if (result.isSuccess()) {
      expect(result.value.favorites).toHaveLength(0)
    }
  })

  it('should handle missing products gracefully', async () => {
    const favorite = makeFavorite({
      clientId: 'client-1',
      productId: 'non-existent-id',
    })
    inMemory.FavoriteRepository.items.push(favorite)

    const result = await sut.execute({ clientId: 'client-1' })

    expect(result.isSuccess()).toBe(true)
    if (result.isSuccess()) {
      expect(result.value.favorites).toHaveLength(1)
      expect(result.value.favorites[0].product).toBeNull()
    }
  })
})
