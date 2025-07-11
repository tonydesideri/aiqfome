import { ERROR_TYPES } from 'src/core/src/errors'
import { makeClient } from 'test/factories/make-client.factory'
import {
  InMemoryRepositoriesProps,
  makeInMemoryRepositories,
} from 'test/factories/make-in-memory-repositories.factory'
import { beforeEach, describe, expect, it } from 'vitest'
import { UpdateClientUseCase } from './update-client.use-case'

describe('UpdateClientUseCase', () => {
  let sut: UpdateClientUseCase
  let inMemory: InMemoryRepositoriesProps

  beforeEach(() => {
    inMemory = makeInMemoryRepositories()
    sut = new UpdateClientUseCase(inMemory.ClientRepository)
  })

  it('should update client data successfully', async () => {
    const client = makeClient({ name: 'Old Name', email: 'old@email.com' })
    await inMemory.ClientRepository.create(client)

    const result = await sut.execute({
      id: client.id.toString(),
      name: 'New Name',
      email: 'new@email.com',
    })
    expect(result.isSuccess()).toBe(true)
    if (result.isSuccess()) {
      expect(result.value.client.name).toBe('New Name')
      expect(result.value.client.email).toBe('new@email.com')
    }
  })

  it('should return failure if client does not exist', async () => {
    const result = await sut.execute({
      id: 'non-existent-id',
      name: 'Name',
      email: 'email@email.com',
    })
    expect(result.isFailure()).toBe(true)
    if (result.isFailure()) {
      expect(result.value.errorType).toBe(ERROR_TYPES.RESOURCE_NOT_FOUND)
    }
  })

  it('should return failure if email is already in use by another client', async () => {
    const client1 = makeClient({ email: 'used@email.com' })
    const client2 = makeClient({ email: 'other@email.com' })
    await inMemory.ClientRepository.create(client1)
    await inMemory.ClientRepository.create(client2)

    const result = await sut.execute({
      id: client2.id.toString(),
      name: 'Name',
      email: 'used@email.com',
    })
    expect(result.isFailure()).toBe(true)
    if (result.isFailure()) {
      expect(result.value.errorType).toBe(ERROR_TYPES.RESOURCE_EXISTS)
    }
  })
})
