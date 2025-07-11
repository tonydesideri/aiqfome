import { ERROR_TYPES } from 'src/core/src/errors'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import {
  InMemoryRepositoriesProps,
  makeInMemoryRepositories,
} from 'test/factories/make-in-memory-repositories.factory'
import { makeUser } from 'test/factories/make-user.factory'
import { describe, expect, it } from 'vitest'
import { SignInUseCase } from './sign-in.use-case'

describe('SignInUseCase', () => {
  let inMemory: InMemoryRepositoriesProps
  let fakeHasher: FakeHasher
  let fakeEncrypter: FakeEncrypter

  let sut: SignInUseCase

  beforeEach(() => {
    inMemory = makeInMemoryRepositories()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()

    sut = new SignInUseCase(inMemory.UserRepository, fakeHasher, fakeEncrypter)
  })

  it('should be able sign in user', async () => {
    const user = makeUser({
      password: await fakeHasher.hash('12345678'),
    })

    inMemory.UserRepository.items.push(user)

    const result = await sut.execute({
      email: user.email,
      password: '12345678',
    })

    expect(result.isSuccess()).toBe(true)
  })

  it('should not be possible to sign in with incorrect password', async () => {
    const user = makeUser()
    inMemory.UserRepository.items.push(user)

    const result = await sut.execute({
      email: user.email,
      password: '12345678',
    })

    expect(result.isFailure()).toBe(true)
    if (result.isFailure())
      expect(result.value.errorType).toBe(ERROR_TYPES.INVALID_CREDENTIALS)
  })
})
