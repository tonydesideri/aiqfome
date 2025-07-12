import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common'
import { ERROR_TYPES } from 'src/core/src/errors'
import { RemoveFavoriteUseCase } from 'src/domain/application/use-cases/remove-favorite.use-case'
import { RemoveFavoriteDto } from '../dtos/remove-favorite.dto'

@Controller('/favorites')
export class RemoveFavoriteController {
  constructor(private removeFavoriteUseCase: RemoveFavoriteUseCase) {}

  @Delete(':productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(
    @Param('productId') productId: string,
    @Query() query: RemoveFavoriteDto
  ) {
    const { clientId } = query

    if (!clientId) {
      throw new BadRequestException('clientId é obrigatório')
    }

    const result = await this.removeFavoriteUseCase.execute({
      productId,
      clientId,
    })

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
