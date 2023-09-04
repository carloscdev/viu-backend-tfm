import { IsString, IsEmail } from 'class-validator';

export class LoginUserDto {
  @IsEmail(
    {},
    {
      message: 'El "email" debe ser un correo electrónico válido',
    },
  )
  email: string;

  @IsString({
    message: 'El "password" debe ser un texto',
  })
  password: string;
}
