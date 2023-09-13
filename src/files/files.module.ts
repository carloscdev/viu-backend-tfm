import { Module, forwardRef } from '@nestjs/common';
import { FilesService } from './files.service';
import { CloudinaryProvider } from './files.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { FilesController } from './files.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [FilesController],
  providers: [CloudinaryProvider, FilesService],
  imports: [TypeOrmModule.forFeature([File]), forwardRef(() => UsersModule)],
})
export class FilesModule {}
