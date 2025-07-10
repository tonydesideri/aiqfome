import type { PaginationParams } from './pagination-params.contract'

export abstract class BaseRepository<T> {
  abstract create(data: T): Promise<void>
  abstract save(data: T): Promise<void>
  abstract findManyRecent(page: PaginationParams): Promise<T[]>
  abstract findById(id: string): Promise<T | null>
  abstract delete(id: string): Promise<void>
}
