import { BadRequestException } from '@nestjs/common'

interface Error {
  error: string
}

export class ValidationException extends BadRequestException {
  constructor(public validationErrors: Error[]) {
    super()
  }
}
