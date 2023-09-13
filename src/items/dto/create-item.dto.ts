import { IsNumber, IsString } from 'class-validator';

export class CreateItemDto {
  @IsNumber(
    {},
    {
      message: 'El "documentId" debe ser un número',
    },
  )
  documentId: number;

  @IsString({
    message: 'El "contenido" debe ser un texto',
  })
  content: string;

  @IsNumber(
    {},
    {
      message: 'La "posición" debe ser un número',
    },
  )
  position: number;
}
