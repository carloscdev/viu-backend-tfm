import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { handleError } from 'src/utils/handleError';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async create(createItemDto: CreateItemDto) {
    try {
      const item = this.itemRepository.create(createItemDto);
      await this.itemRepository.save(item);
      return item;
    } catch (error) {
      handleError(error, 'Create Item');
    }
  }

  async findAllByDocument(documentId: number) {
    try {
      return await this.itemRepository.find({
        where: {
          documentId,
        },
        order: {
          position: 'ASC',
        },
      });
    } catch (error) {
      handleError(error, 'Find All Items By Document');
    }
  }

  async findOneById(itemId: number) {
    try {
      const item = await this.itemRepository.findOneBy({ itemId });
      if (!item) {
        throw new NotFoundException('No se encontró el item');
      }
      return item;
    } catch (error) {
      handleError(error, 'Find One Item By Id');
    }
  }

  async update(itemId: number, updateItemDto: UpdateItemDto) {
    try {
      const { content, position } = updateItemDto;
      const item = await this.findOneById(itemId);
      item.content = content;
      item.position = position;
      await this.itemRepository.save(item);
      return item;
    } catch (error) {
      handleError(error, 'Update Item');
    }
  }

  async remove(itemId: number) {
    try {
      await this.findOneById(itemId);
      await this.itemRepository.delete({ itemId });
      return {
        statusCode: 200,
        message: 'Se eliminó el item',
      };
    } catch (error) {
      handleError(error, 'Remove Item');
    }
  }
}
