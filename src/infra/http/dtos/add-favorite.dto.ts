import { IsNotEmpty, IsString } from 'class-validator'

export class AddFavoriteDto {
  @IsString()
  @IsNotEmpty()
  clientId: string

  @IsString()
  @IsNotEmpty()
  productId: string
}
