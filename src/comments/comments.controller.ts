import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Auth } from 'src/users/decorators/auth.decorator';
import { GetUser } from 'src/users/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @Auth()
  create(@GetUser() user: User, @Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(user, createCommentDto);
  }

  @Get('/document/:documentId')
  findAllByDocumentPublic(@Param('documentId') documentId: string) {
    return this.commentsService.findAllByDocumentPublic(+documentId);
  }

  @Get('/total')
  @Auth()
  findTotalByUser(@GetUser() user: User) {
    return this.commentsService.findTotalByUser(user);
  }

  @Delete(':id')
  @Auth()
  remove(@GetUser() user: User, @Param('id') id: string) {
    return this.commentsService.remove(+id, user);
  }
}
