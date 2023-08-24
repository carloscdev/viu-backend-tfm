import { Module, forwardRef } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService],
  imports: [
    TypeOrmModule.forFeature([Document]),
    forwardRef(() => UsersModule),
  ],
})
export class DocumentsModule {}
