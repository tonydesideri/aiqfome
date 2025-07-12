import { IsNotEmpty, IsString } from 'class-validator'

export class ListFavoritesDto {
  @IsString()
  @IsNotEmpty()
  clientId: string
}
