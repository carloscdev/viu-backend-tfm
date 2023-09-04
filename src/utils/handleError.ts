import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

const logger = new Logger();

export const handleError = (error: any, title?: string) => {
  logger.error(title ? `[${title}]` : '[handleError]');
  logger.error(error);

  if (error.code === '23505') {
    logger.error('Ya existe un registro con los mismos datos');
    throw new BadRequestException('Ya existe un registro con los mismos datos');
  }

  const status = error?.status || 500;
  const message = error?.message || 'Error en el servidor';
  switch (status) {
    case 404:
      throw new NotFoundException(message);
    case 400:
      throw new BadRequestException(message);
    case 500:
      throw new InternalServerErrorException(message);
    case 401:
      throw new UnauthorizedException(message);
    case 403:
      throw new ForbiddenException(message);
  }
};
