import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { ERROR_TYPES } from 'src/core/src/errors'
import { DeleteClientUseCase } from 'src/domain/application/use-cases/delete-client.use-case'

@Controller('/clients')
export class DeleteClientController {
  constructor(private deleteClientUseCase: DeleteClientUseCase) {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(@Param('id') id: string) {
    const result = await this.deleteClientUseCase.execute({ id })

    if (result.isFailure()) {
      const error = result.value

      switch (error.errorType) {
        case ERROR_TYPES.RESOURCE_NOT_FOUND:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
