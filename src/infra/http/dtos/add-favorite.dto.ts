import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class AddFavoriteDto {
  @ApiProperty({
    description: 'ID do cliente',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  clientId: string

  @ApiProperty({
    description: 'ID do produto',
    example: '1',
  })
  @IsString()
  @IsNotEmpty()
  productId: string
}
