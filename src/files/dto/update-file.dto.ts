import { IsString } from 'class-validator';

export class UpdateFileNameDto {
  @IsString({
    message: 'El "nombre" debe ser un texto',
  })
  name: string;
}
