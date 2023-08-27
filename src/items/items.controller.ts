import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Auth } from 'src/users/decorators/auth.decorator';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @Auth()
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemsService.create(createItemDto);
  }

  @Get('/document/:documentId')
  @Auth()
  findAllByDocument(@Param('documentId') documentId: string) {
    return this.itemsService.findAllByDocument(+documentId);
  }

  @Get(':id')
  @Auth()
  findOneById(@Param('id') id: string) {
    return this.itemsService.findOneById(+id);
  }

  @Patch(':id')
  @Auth()
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(+id, updateItemDto);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string) {
    return this.itemsService.remove(+id);
  }
}
