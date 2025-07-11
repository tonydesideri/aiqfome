import { makeClient } from 'test/factories/make-client.factory'
import {
  InMemoryRepositoriesProps,
  makeInMemoryRepositories,
} from 'test/factories/make-in-memory-repositories.factory'
import { beforeEach, describe, expect, it } from 'vitest'
import { ListClientsUseCase } from './list-clients.use-case'

describe('ListClientsUseCase', () => {
  let sut: ListClientsUseCase
  let inMemory: InMemoryRepositoriesProps

  beforeEach(() => {
    inMemory = makeInMemoryRepositories()
    sut = new ListClientsUseCase(inMemory.ClientRepository)
  })

  it('should return all clients', async () => {
    const client1 = makeClient()
    const client2 = makeClient()
    await inMemory.ClientRepository.create(client1)
    await inMemory.ClientRepository.create(client2)

    const result = await sut.execute()
    expect(result.isSuccess()).toBe(true)
    if (result.isSuccess()) {
      expect(result.value.clients.length).toBe(2)
      expect(result.value.clients.map(c => c.id.toString())).toContain(
        client1.id.toString()
      )
      expect(result.value.clients.map(c => c.id.toString())).toContain(
        client2.id.toString()
      )
    }
  })

  it('should return an empty array if there are no clients', async () => {
    const result = await sut.execute()
    expect(result.isSuccess()).toBe(true)
    if (result.isSuccess()) {
      expect(result.value.clients.length).toBe(0)
    }
  })
})
