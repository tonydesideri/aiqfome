import type { UseCaseError } from '../use-case-error.contract'
import type { ERROR_TYPES } from './error-types'

export class ResourceError<T extends ERROR_TYPES>
  extends Error
  implements UseCaseError
{
  constructor(
    public readonly errorType: T,
    public readonly message: string
  ) {
    super(message)
  }
}
