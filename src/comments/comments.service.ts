import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from 'src/users/entities/user.entity';
import { handleError } from 'src/utils/handleError';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { MailsService } from 'src/mails/mails.service';
import { Document } from 'src/documents/entities/document.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly mailService: MailsService,
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
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

      const document = await this.documentRepository.find({
        relations: ['user'],
        where: {
          documentId,
        },
      });
      this.mailService.sendMailUpdate(
        document[0].user,
        `Se ha publicado un nuevo comentario en tu documento "${document[0].title}." \n
        Comentario: ${content}`,
        `https://viu-hub.carlosc.dev/publico/${document[0].slug}`,
      );
      return comment;
    } catch (error) {
      handleError(error, 'Create Comment');
    }
  }

  async findTotalByUser(user: User) {
    try {
      const comments = await this.commentRepository.find({
        relations: ['document'],
        where: { document: { userId: user.userId } },
      });
      return {
        statusCode: 200,
        total: comments.length,
      };
    } catch (error) {
      handleError(error, 'Find Total Comments By User');
    }
  }

  async findAllByDocumentPublic(documentId: number) {
    try {
      return await this.commentRepository.find({
        relations: ['user'],
        where: {
          documentId,
        },
        order: {
          createdAt: 'DESC',
        },
      });
    } catch (error) {
      handleError(error, 'Find All Comments By Document Public');
    }
  }

  async remove(commentId: number, user: User) {
    try {
      const comment = await this.commentRepository.findOneBy({ commentId });
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
