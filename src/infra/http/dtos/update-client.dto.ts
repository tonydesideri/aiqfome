import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MinLength } from 'class-validator'

export class UpdateClientDto {
  @ApiProperty({
    description: 'Nome do cliente',
    example: 'João Silva Atualizado',
    minLength: 2,
  })
  @IsString()
  @MinLength(2)
  name: string

  @ApiProperty({
    description: 'Email do cliente',
    example: 'joao.silva.atualizado@email.com',
  })
  @IsEmail()
  email: string
}
