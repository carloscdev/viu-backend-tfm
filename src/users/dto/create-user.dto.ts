import { IsString, MinLength, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString({
    message: 'El "nombre" debe ser un texto',
  })
  @MinLength(8, {
    message: 'El "nombre" debe tener al menos 8 caracteres',
  })
  name: string;

  @IsEmail(
    {},
    {
      message: 'El "email" debe ser un email válido',
    },
  )
  email: string;

  @IsNotEmpty({
    message: 'El "password" no debe estar vacío',
  })
  @MinLength(8, {
    message: 'El "password" debe tener al menos 8 caracteres',
  })
  //   @Matches(
  //     /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //     message: 'El "password" debe tener al menos una letra mayúscula, una letra minúscula y un número o caracter especial'
  //   })
  password: string;

  @IsNotEmpty({
    message: 'El "passwordConfirm" no debe estar vacío',
  })
  @MinLength(8, {
    message: 'El "passwordConfirm" debe tener al menos 8 caracteres',
  })
  passwordConfirm: string;
}
