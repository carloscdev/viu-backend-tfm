import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString({
    message: 'El título debe ser un texto',
  })
  title: string;
}
