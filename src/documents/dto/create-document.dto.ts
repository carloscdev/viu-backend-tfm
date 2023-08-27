import { IsBoolean, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateDocumentDto {
  @IsNumber(
    {},
    {
      message: 'El "categoryId" debe ser un id válido',
    },
  )
  categoryId: number;

  @IsString({
    message: 'El "título" debe ser un texto',
  })
  @MaxLength(50, {
    message: 'El "title" debe tener menos de 50 caracteres',
  })
  title: string;

  @IsString({
    message: 'La "description" debe ser un texto',
  })
  @MaxLength(100, {
    message: 'La "descripción" debe tener menos de 100 caracteres',
  })
  description: string;

  @IsBoolean({
    message: '"isPublished" debe ser un booleano',
  })
  isPublished: boolean;
}
