import { ERROR_TYPES } from 'src/core/src/errors'
import { makeClient } from 'test/factories/make-client.factory'
import {
  InMemoryRepositoriesProps,
  makeInMemoryRepositories,
} from 'test/factories/make-in-memory-repositories.factory'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateClientUseCase } from './create-client.use-case'

describe('CreateClientUseCase', () => {
  let sut: CreateClientUseCase
  let inMemory: InMemoryRepositoriesProps

  beforeEach(() => {
    inMemory = makeInMemoryRepositories()
    sut = new CreateClientUseCase(inMemory.ClientRepository)
  })

  it('should create a new client successfully', async () => {
    const result = await sut.execute({
      name: 'Cliente Teste',
      email: 'cliente@teste.com',
    })
    expect(result.isSuccess()).toBe(true)
    if (result.isSuccess()) {
      expect(result.value.client.name).toBe('Cliente Teste')
      expect(result.value.client.email).toBe('cliente@teste.com')
    }
  })

  it('should not allow creating a client with duplicate email', async () => {
    const client = makeClient({ email: 'duplicado@teste.com' })
    await inMemory.ClientRepository.create(client)

    const result = await sut.execute({
      name: 'Outro Cliente',
      email: 'duplicado@teste.com',
    })
    expect(result.isFailure()).toBe(true)
    if (result.isFailure()) {
      expect(result.value.errorType).toBe(ERROR_TYPES.RESOURCE_EXISTS)
    }
  })
})
