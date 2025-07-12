import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MinLength } from 'class-validator'

export class SignInDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'admin@admin.com',
  })
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'Senha do usuário (mínimo 6 caracteres)',
    example: 'admin123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string
}
