import { Module, forwardRef } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { UsersModule } from 'src/users/users.module';
import { Item } from 'src/items/entities/item.entity';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService],
  imports: [
    TypeOrmModule.forFeature([Document, Item]),
    forwardRef(() => UsersModule),
  ],
})
export class DocumentsModule {}
