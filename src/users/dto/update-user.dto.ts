import { IsString, MinLength, IsEmail } from 'class-validator';

export class UpdateProfileDto {
  @IsString({
    message: 'El "name" debe ser un texto',
  })
  @MinLength(8, {
    message: 'El "name" debe tener al menos 8 caracteres',
  })
  name: string;

  @IsEmail(
    {},
    {
      message: 'El "email" debe ser un email válido',
    },
  )
  email: string;
}

export class UpdatePasswordDto {
  @IsString({
    message: 'El "password" debe ser un texto',
  })
  @MinLength(8, {
    message: 'El "password" debe tener al menos 8 caracteres',
  })
  password: string;

  @IsString({
    message: 'El "newPassword" debe ser un texto',
  })
  @MinLength(8, {
    message: 'El "newPassword" debe tener al menos 8 caracteres',
  })
  newPassword: string;

  @IsString({
    message: 'El "confirmPassword" debe ser un texto',
  })
  @MinLength(8, {
    message: 'El "confirmPassword" debe tener al menos 8 caracteres',
  })
  confirmPassword: string;
}
