import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { User } from 'src/users/entities/user.entity';
import { handleSlug } from 'src/utils/handleSlug';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { handleError } from 'src/utils/handleError';
import { Item } from 'src/items/entities/item.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
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

  async findAllByUser(user: User) {
    try {
      return await this.documentRepository.find({
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

  async findAllPublic() {
    try {
      return await this.documentRepository.find({
        relations: ['category', 'user'],
        where: {
          isDeleted: false,
          isPublished: true,
        },
        order: {
          updatedAt: 'DESC',
        },
      });
    } catch (error) {
      handleError(error, 'Find All Documents');
    }
  }

  async findRecent() {
    try {
      const documents = await this.documentRepository.find({
        relations: ['category', 'user'],
        where: {
          isDeleted: false,
          isPublished: true,
        },
        order: {
          updatedAt: 'DESC',
        },
        take: 5,
      });
      return documents;
    } catch (error) {
      handleError(error, 'Find Recent Documents');
    }
  }

  async findTotalByUser(user: User) {
    try {
      const documents = await this.documentRepository.find({
        where: {
          userId: user.userId,
          isPublished: true,
          isDeleted: false,
        },
      });
      return {
        statusCode: 200,
        total: documents.length,
      };
    } catch (error) {
      handleError(error, 'Find All Documents');
    }
  }

  async findOneById(documentId: number, user) {
    try {
      const { userId } = user;
      const document = await this.documentRepository.findOneBy({
        documentId,
        userId,
        isDeleted: false,
      });
      if (!document) {
        throw new NotFoundException(
          `No se encontró el documento con ID: ${documentId}`,
        );
      }
      return document;
    } catch (error) {
      handleError(error, 'Find One Document By Id');
    }
  }

  async findOneBySlugPublic(slug: string) {
    try {
      const document = await this.documentRepository.find({
        relations: ['category', 'user'],
        where: {
          slug,
          isDeleted: false,
          isPublished: true,
        },
      });
      if (document.length === 0) {
        throw new NotFoundException(`No se encontró el documento`);
      }

      const items = await this.itemRepository.find({
        where: {
          documentId: document[0].documentId,
        },
        order: {
          position: 'ASC',
        },
      });

      return {
        document: document[0],
        items,
      };
    } catch (error) {
      handleError(error, 'Find One Document By Slug');
    }
  }

  async update(
    documentId: number,
    user: User,
    updateDocumentDto: UpdateDocumentDto,
  ) {
    try {
      const { categoryId, title, description, isPublished } = updateDocumentDto;
      const document = await this.findOneById(documentId, user);
      document.categoryId = categoryId;
      document.title = title;
      document.slug = handleSlug(title);
      document.description = description;
      document.isPublished = isPublished;

      await this.documentRepository.save(document);
      return document;
    } catch (error) {
      handleError(error, 'Update Document');
    }
  }

  async remove(documentId: number, user: User) {
    try {
      const today = new Date();
      const document = await this.findOneById(documentId, user);
      document.isPublished = false;
      document.isDeleted = true;
      document.title += today;
      await this.documentRepository.save(document);
      return {
        statusCode: 200,
        message: 'Documento eliminado',
      };
    } catch (error) {
      handleError(error, 'Remove Document');
    }
  }
}
