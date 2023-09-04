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
    message: 'El "content" debe ser un texto',
  })
  content: string;

  @IsNumber(
    {},
    {
      message: 'La "position" debe ser un número',
    },
  )
  position: number;
}
