import { Module, forwardRef } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { UsersModule } from 'src/users/users.module';
import { Item } from 'src/items/entities/item.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Favorite } from 'src/favorites/entities/favorite.entity';
import { File } from 'src/files/entities/file.entity';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService],
  imports: [
    TypeOrmModule.forFeature([Document, Item, Comment, Favorite, File]),
    forwardRef(() => UsersModule),
  ],
})
export class DocumentsModule {}
