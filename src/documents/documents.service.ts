import { Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { User } from 'src/users/entities/user.entity';
import { handleSlug } from 'src/utils/handleSlug';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { handleError } from 'src/utils/handleError';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  async create(user: User, createDocumentDto: CreateDocumentDto) {
    try {
      const { categoryId, title, description, isPublished } = createDocumentDto;
      const body = {
        userId: user.userId,
        categoryId,
        title,
        slug: handleSlug(title),
        description,
        isPublished,
      };
      const document = this.documentRepository.create(body);
      await this.documentRepository.save(document);
      return document;
    } catch (error) {
      handleError(error, 'Create Document');
    }
  }

  findAllByUser(user: User) {
    try {
      return this.documentRepository.find({
        relations: ['category'],
        where: {
          userId: user.userId,
          isDeleted: false,
        },
        order: {
          createdAt: 'DESC',
        },
      });
    } catch (error) {
      handleError(error, 'Find All Documents By User');
    }
  }

  findAllPublic() {
    try {
      return this.documentRepository.find({
        relations: ['category', 'user'],
        where: {
          isDeleted: false,
          isPublished: true,
        },
        order: {
          createdAt: 'DESC',
        },
      });
    } catch (error) {
      handleError(error, 'Find All Documents');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} document`;
  }

  update(id: number, updateDocumentDto: UpdateDocumentDto) {
    return `This action updates a #${id} document`;
  }

  remove(id: number) {
    return `This action removes a #${id} document`;
  }
}
