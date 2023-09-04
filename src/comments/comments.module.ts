import { Module, forwardRef } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from './entities/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Document } from 'src/documents/entities/document.entity';
import { User } from 'src/users/entities/user.entity';
import { MailsModule } from 'src/mails/mails.module';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  imports: [
    MailsModule,
    TypeOrmModule.forFeature([Comment, Document, User]),
    forwardRef(() => UsersModule),
  ],
})
export class CommentsModule {}
