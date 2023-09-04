import { IsNumber } from 'class-validator';

export class CreateFavoriteDto {
  @IsNumber(
    {},
    {
      message: 'El "documentId" debe ser un número',
    },
  )
  documentId: number;
}
