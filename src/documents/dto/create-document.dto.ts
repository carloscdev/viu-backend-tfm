import { IsBoolean, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateDocumentDto {
  @IsNumber(
    {},
    {
      message: 'El ID de la categoría debe ser un id válido',
    },
  )
  categoryId: number;

  @IsString({
    message: 'El título debe ser un texto',
  })
  @MaxLength(100, {
    message: 'El título debe tener menos de 100 caracteres',
  })
  title: string;

  @IsString({
    message: 'La descripción debe ser un texto',
  })
  @MaxLength(1000, {
    message: 'La descripción debe tener menos de 1000 caracteres',
  })
  description: string;

  @IsBoolean({
    message: '"isPublished" debe ser un booleano',
  })
  isPublished: boolean;
}
