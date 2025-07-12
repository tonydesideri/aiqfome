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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { ERROR_TYPES } from 'src/core/src/errors'
import { RemoveFavoriteUseCase } from 'src/domain/application/use-cases/remove-favorite.use-case'
import { RemoveFavoriteDto } from '../dtos/remove-favorite.dto'

@ApiTags('Favoritos')
@ApiBearerAuth('JWT-auth')
@Controller('/favorites')
export class RemoveFavoriteController {
  constructor(private removeFavoriteUseCase: RemoveFavoriteUseCase) {}

  @Delete(':productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remover favorito',
    description: 'Remove um produto da lista de favoritos de um cliente',
  })
  @ApiParam({
    name: 'productId',
    description: 'ID do produto',
    example: '1',
  })
  @ApiQuery({
    name: 'clientId',
    description: 'ID do cliente',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'Favorito removido com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Favorito não encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
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
