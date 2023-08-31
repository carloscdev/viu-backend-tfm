import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { User } from 'src/users/entities/user.entity';
import { handleError } from 'src/utils/handleError';
import { Favorite } from './entities/favorite.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
  ) {}

  async create(createFavoriteDto: CreateFavoriteDto, user: User) {
    try {
      const { documentId } = createFavoriteDto;
      if (await this.findOne(user, documentId)) {
        throw new BadRequestException('Ya se encuentra en favoritos');
      }
      const favorite = this.favoriteRepository.create({
        documentId,
        userId: user.userId,
      });
      await this.favoriteRepository.save(favorite);
      return favorite;
    } catch (error) {
      handleError(error, 'Create Favorite');
    }
  }

  async findOne(user: User, documentId: number) {
    try {
      return await this.favoriteRepository.findOne({
        where: {
          userId: user.userId,
          documentId,
        },
      });
    } catch (error) {
      handleError(error, 'Find One Favorite');
    }
  }

  async validate(user: User, documentId: number) {
    try {
      const favorite = await this.findOne(user, documentId);
      if (!favorite) {
        throw new BadRequestException('No se encuentra en favoritos');
      }
      return {
        statusCode: 200,
        message: 'Se encuentra en favoritos',
      };
    } catch (error) {
      handleError(error, 'Validate Favorite');
    }
  }

  async findAllByUser(user: User) {
    try {
      const favorites = await this.favoriteRepository.find({
        relations: ['document', 'user', 'document.category'],
        where: {
          userId: user.userId,
          document: {
            isPublished: true,
            isDeleted: false,
          },
        },
      });
      return favorites;
    } catch (error) {
      handleError(error, 'Find All Favorites');
    }
  }

  async findTotalByUser(user: User) {
    try {
      const favorites = await this.findAllByUser(user);
      return {
        statusCode: 200,
        total: favorites.length,
      };
    } catch (error) {
      handleError(error, 'Find Total Favorites');
    }
  }

  async remove(favoriteId: number, user: User) {
    try {
      const favorite = await this.favoriteRepository.findOne({
        where: {
          favoriteId,
          userId: user.userId,
        },
      });
      if (!favorite) {
        throw new BadRequestException('No se pudo eliminar');
      }
      await this.favoriteRepository.delete({ favoriteId });
      return {
        statusCode: 200,
        message: 'Se eliminó de favoritos',
      };
    } catch (error) {
      handleError(error, 'Remove Favorite');
    }
  }
}
