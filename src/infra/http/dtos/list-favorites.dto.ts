import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class ListFavoritesDto {
  @ApiProperty({
    description: 'ID do cliente para listar seus favoritos',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  clientId: string
}
