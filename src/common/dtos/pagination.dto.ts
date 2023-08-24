import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive({
    message: 'El "limit" debe ser un número positivo',
  })
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @Min(0, {
    message: 'El "offset" debe ser mayor a 0',
  })
  @Type(() => Number)
  offset?: number;
}
