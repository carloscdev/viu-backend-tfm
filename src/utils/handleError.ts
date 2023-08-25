import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

const logger = new Logger();

export const handleError = (error: any, title?: string) => {
  logger.error(`Ocurrió un error => ${title}` || 'Ocurrió un error inesperado');
  logger.error(error);
  if (error.code === '23505') {
    logger.error('Ya existe un registro con los mismos datos');
    throw new BadRequestException('Ya existe un registro con los mismos datos');
  }
  throw new InternalServerErrorException(
    error.message || 'Ocurrió un error inesperado',
  );
};
