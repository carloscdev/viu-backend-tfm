import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

const logger = new Logger();

export const handleError = (error: any) => {
  logger.error('=== Ocurrió un error ===');
  if (error.code === '23505') {
    logger.error('Ya existe un registro con los mismos datos');
    throw new BadRequestException('Ya existe un registro con los mismos datos');
  }
  logger.error(error);
  throw new InternalServerErrorException(
    error.message || 'Ocurrió un error inesperado',
  );
};
