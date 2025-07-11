import { ERROR_TYPES } from 'src/core/src/errors'
import { makeClient } from 'test/factories/make-client.factory'
import {
  InMemoryRepositoriesProps,
  makeInMemoryRepositories,
} from 'test/factories/make-in-memory-repositories.factory'
import { beforeEach, describe, expect, it } from 'vitest'
import { DeleteClientUseCase } from './delete-client.use-case'

describe('DeleteClientUseCase', () => {
  let sut: DeleteClientUseCase
  let inMemory: InMemoryRepositoriesProps

  beforeEach(() => {
    inMemory = makeInMemoryRepositories()
    sut = new DeleteClientUseCase(inMemory.ClientRepository)
  })

  it('should delete a client successfully', async () => {
    const client = makeClient()
    await inMemory.ClientRepository.create(client)

    const result = await sut.execute({ id: client.id.toString() })
    expect(result.isSuccess()).toBe(true)
    expect(inMemory.ClientRepository.items.length).toBe(0)
  })

  it('should return failure if client does not exist', async () => {
    const result = await sut.execute({ id: 'non-existent-id' })
    expect(result.isFailure()).toBe(true)
    if (result.isFailure()) {
      expect(result.value.errorType).toBe(ERROR_TYPES.RESOURCE_NOT_FOUND)
    }
  })
})
