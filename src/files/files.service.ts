import { Injectable, NotFoundException } from '@nestjs/common';
// import { v2 as cloudinary } from 'cloudinary';

import { CloudinaryResponse } from './files.response';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { Repository } from 'typeorm';
import { handleError } from 'src/utils/handleError';
import { UpdateFileNameDto } from './dto/update-file.dto';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}

  async create(file: Express.Multer.File, name: string, documentId: number) {
    try {
      const response = this.fileRepository.create({
        documentId,
        name: name,
      });
      // const currentFile = await this.uploadFile(file, name);
      const currentFile = { url: 'https://viu-hub.carlosc.dev' };
      const { url } = currentFile;
      response.url = url;
      await this.fileRepository.save(response);
      return response;
    } catch (error) {
      handleError(error, 'Create File');
    }
  }

  async findAllByDocument(documentId: number) {
    try {
      const files = await this.fileRepository.find({
        where: {
          documentId,
        },
        order: {
          name: 'ASC',
        },
      });
      return files;
    } catch (error) {
      handleError(error, 'Find All Files');
    }
  }

  async updateNameFile(fileId: number, updateFileNameDto: UpdateFileNameDto) {
    try {
      const { name } = updateFileNameDto;
      const file = await this.fileRepository.findOneBy({ fileId });
      file.name = name;
      await this.fileRepository.save(file);
      return file;
    } catch (error) {
      handleError(error, 'Update File Name');
    }
  }

  async deleteFile(fileId: number) {
    try {
      const file = await this.fileRepository.findOneBy({ fileId });
      if (!file) {
        throw new NotFoundException('No se encontró el item');
      }
      await this.fileRepository.remove(file);
      return {
        statusCode: 200,
        message: 'Se eliminó el archivo',
      };
    } catch (error) {
      handleError(error, 'Delete File');
    }
  }

  // uploadFile(
  //   file: Express.Multer.File,
  //   name: string,
  // ): Promise<CloudinaryResponse> {
  //   return new Promise((resolve, reject) => {
  //     cloudinary.uploader
  //       .upload_stream(
  //         {
  //           resource_type: 'auto',
  //           folder: 'viu-tfm',
  //           public_id:
  //             `${name.replace(/\s/g, '-')}-${new Date()
  //               .toLocaleDateString('en-GB')
  //               .replace(/\//g, '-')}-` + file.originalname,
  //         },
  //         (error, result) => {
  //           if (error) {
  //             console.log('ERRORRRR', error);
  //             return reject(error);
  //           }
  //           resolve(result);
  //         },
  //       )
  //       .end(file.buffer);
  //   });
  // }
}
