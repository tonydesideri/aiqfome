import { IsNotEmpty, IsString } from 'class-validator'

export class RemoveFavoriteDto {
  @IsString()
  @IsNotEmpty()
  clientId: string
}
