import { describe, expect, it } from 'vitest'
import { UniqueEntityID } from './unique-entity-id'

describe('UniqueEntityID', () => {
  it('should not generate duplicate IDs', () => {
    const ids = new Set<string>()
    const iterations = 1000000 // número grande de IDs para testar colisões

    for (let i = 0; i < iterations; i++) {
      const id = new UniqueEntityID().toString()
      if (ids.has(id)) {
        // Se já existir no conjunto, o teste falha
        throw new Error(`Duplicate ID found: ${id}`)
      }
      ids.add(id)
    }

    expect(ids.size).toBe(iterations) // Garante que todos os IDs são únicos
  })

  it('should return the same ID if provided', () => {
    const idValue = 'existing-id'
    const id = new UniqueEntityID(idValue)
    expect(id.toString()).toBe(idValue)
  })

  it('should correctly compare two IDs', () => {
    const idValue = 'existing-id'
    const id1 = new UniqueEntityID(idValue)
    const id2 = new UniqueEntityID(idValue)
    const id3 = new UniqueEntityID()

    expect(id1.equals(id2)).toBe(true)
    expect(id1.equals(id3)).toBe(false)
  })
})
