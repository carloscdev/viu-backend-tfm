import { IsString, MinLength, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString({
    message: 'El nombre debe ser un texto',
  })
  @MinLength(5, {
    message: 'El nombre debe tener al menos 5 caracteres',
  })
  name: string;

  @IsEmail(
    {},
    {
      message: 'El correo electrónico debe ser un email válido',
    },
  )
  email: string;

  @IsNotEmpty({
    message: 'La contraseña no debe estar vacío',
  })
  @MinLength(8, {
    message: 'La contraseña debe tener al menos 8 caracteres',
  })
  //   @Matches(
  //     /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //     message: 'El "password" debe tener al menos una letra mayúscula, una letra minúscula y un número o caracter especial'
  //   })
  password: string;

  @IsNotEmpty({
    message: 'La confirmación de contraseña no debe estar vacío',
  })
  @MinLength(8, {
    message: 'La confirmación de contraseña debe tener al menos 8 caracteres',
  })
  passwordConfirm: string;
}
