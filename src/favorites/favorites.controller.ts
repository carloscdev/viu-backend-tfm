import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { Auth } from 'src/users/decorators/auth.decorator';
import { GetUser } from 'src/users/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  @Auth()
  create(@GetUser() user: User, @Body() createFavoriteDto: CreateFavoriteDto) {
    return this.favoritesService.create(createFavoriteDto, user);
  }

  @Get()
  @Auth()
  findAllByUser(@GetUser() user: User) {
    return this.favoritesService.findAllByUser(user);
  }

  @Get('/total')
  @Auth()
  findTotalByUser(@GetUser() user: User) {
    return this.favoritesService.findTotalByUser(user);
  }

  @Get('validate/:documentId')
  @Auth()
  validate(@GetUser() user: User, @Param('documentId') documentId: string) {
    return this.favoritesService.validate(user, +documentId);
  }

  @Delete(':id')
  @Auth()
  remove(@GetUser() user: User, @Param('id') id: string) {
    return this.favoritesService.remove(+id, user);
  }
}
