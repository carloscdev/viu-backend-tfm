import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString({
    message: 'El "title" debe ser un texto',
  })
  title: string;
}
