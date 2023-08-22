import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { handleError } from 'src/utils/handleError';
import { handleSlug } from 'src/utils/handleSlug';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const title = createCategoryDto.title;
      const body = {
        title,
        slug: handleSlug(title),
      };
      const category = this.categoryRepository.create(body);
      await this.categoryRepository.save(category);
      return category;
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    return await this.categoryRepository.find();
  }

  async findOneById(category_id: number) {
    const category = await this.categoryRepository.findOneBy({ category_id });

    if (!category) {
      throw new NotFoundException('No se encontró la categoría');
    }
    return category;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return updateCategoryDto;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
