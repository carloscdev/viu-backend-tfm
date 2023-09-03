import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth } from 'src/users/decorators/auth.decorator';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Auth()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @Auth()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.categoriesService.findAll(paginationDto);
  }

  @Get('/public')
  findAllPublic() {
    return this.categoriesService.findAllPublic();
  }

  @Get(':id')
  @Auth()
  findOneById(@Param('id') id: string) {
    return this.categoriesService.findOneById(+id);
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
