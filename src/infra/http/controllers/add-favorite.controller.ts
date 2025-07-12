import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
} from '@nestjs/common'
import { ERROR_TYPES } from 'src/core/src/errors'
import { AddFavoriteUseCase } from 'src/domain/application/use-cases/add-favorite.use-case'
import { AddFavoriteDto } from '../dtos/add-favorite.dto'
import { FavoritePresenter } from '../presenters'

@Controller('/favorites')
export class AddFavoriteController {
  constructor(private addFavoriteUseCase: AddFavoriteUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async handle(@Body() body: AddFavoriteDto) {
    const { clientId, productId } = body

    const result = await this.addFavoriteUseCase.execute({
      clientId,
      productId,
    })

    if (result.isFailure()) {
      const error = result.value

      switch (error.errorType) {
        case ERROR_TYPES.RESOURCE_NOT_FOUND:
          throw new NotFoundException(error.message)
        case ERROR_TYPES.RESOURCE_EXISTS:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { favorite } = result.value

    return { favorite: FavoritePresenter.toHTTP(favorite) }
  }
}
