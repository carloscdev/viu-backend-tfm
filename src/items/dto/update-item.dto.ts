import { OmitType } from '@nestjs/mapped-types';
import { CreateItemDto } from './create-item.dto';

export class UpdateItemDto extends OmitType(CreateItemDto, ['documentId']) {}
