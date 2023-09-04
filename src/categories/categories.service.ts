import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { handleError } from 'src/utils/handleError';
import { handleSlug } from 'src/utils/handleSlug';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

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
      handleError(error, 'Create Category');
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;
      return await this.categoryRepository.find({
        take: limit,
        skip: offset,
        order: {
          created_at: 'DESC',
        },
      });
    } catch (error) {
      handleError(error, 'Find All Categories');
    }
  }

  async findAllPublic() {
    try {
      return await this.categoryRepository.find({
        order: {
          title: 'ASC',
        },
      });
    } catch (error) {
      handleError(error, 'Find All Categories');
    }
  }

  async findOneById(categoryId: number) {
    try {
      const category = await this.categoryRepository.findOneBy({ categoryId });

      if (!category) {
        throw new NotFoundException('No se encontró la categoría');
      }
      return category;
    } catch (error) {
      handleError(error, 'Find One Category By Id');
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const title = updateCategoryDto.title;
      const body = {
        title,
        slug: handleSlug(title),
      };
      const category = await this.findOneById(id);
      category.title = body.title;
      category.slug = body.slug;
      await this.categoryRepository.save(category);
      return category;
    } catch (error) {
      handleError(error, 'Update Category');
    }
  }

  remove(id: number) {
    return `No disponible #${id}`;
  }
}
