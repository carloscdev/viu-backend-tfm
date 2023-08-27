import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from 'src/users/entities/user.entity';
import { handleError } from 'src/utils/handleError';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async create(user: User, createCommentDto: CreateCommentDto) {
    try {
      const { documentId, content } = createCommentDto;
      const body = {
        userId: user.userId,
        documentId,
        content,
      };
      const comment = this.commentRepository.create(body);
      await this.commentRepository.save(comment);
      return comment;
    } catch (error) {
      handleError(error, 'Create Comment');
    }
  }

  async findAllByDocumentPublic(documentId: number) {
    try {
      return await this.commentRepository.find({
        where: {
          documentId,
        },
        order: {
          createdAt: 'ASC',
        },
      });
    } catch (error) {
      handleError(error, 'Find All Comments By Document Public');
    }
  }

  async remove(commentId: number, user: User) {
    try {
      const comment = await this.commentRepository.findOneBy({ commentId });
      console.log(comment);
      if (!comment || comment.userId !== user.userId) {
        throw new NotFoundException('No se encontró el comentario');
      }
      await this.commentRepository.delete({ commentId });
      return {
        statusCode: 200,
        message: 'Se eliminó el comentario',
      };
    } catch (error) {
      handleError(error, 'Remove Comment');
    }
  }
}
