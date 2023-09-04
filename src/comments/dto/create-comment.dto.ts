import { IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
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
}
