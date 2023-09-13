import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Put,
  Param,
  Get,
  Delete,
} from '@nestjs/common';
import { Auth } from 'src/users/decorators/auth.decorator';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateFileNameDto } from './dto/update-file.dto';

@Controller('files')
export class FilesController {
  constructor(private readonly filesServices: FilesService) {}

  @Post('/document')
  @Auth()
  @UseInterceptors(FileInterceptor('file'))
  createFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
          new FileTypeValidator({
            fileType: '.(json|doc|xls|html|js|ppt|css|sql|ts|jpg|png|jpeg)',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body('documentId') documentId: string,
    @Body('name') name: string,
  ) {
    return this.filesServices.create(file, name, +documentId);
  }

  @Get('/document/:documentId')
  @Auth()
  findAllFilesByDocument(@Param('documentId') documentId: string) {
    return this.filesServices.findAllByDocument(+documentId);
  }

  @Put('/:fileId')
  @Auth()
  updateNameFile(
    @Param('fileId') fileId: string,
    @Body() updateFileNameDto: UpdateFileNameDto,
  ) {
    return this.filesServices.updateNameFile(+fileId, updateFileNameDto);
  }

  @Delete('/:fileId')
  @Auth()
  deleteFile(@Param('fileId') fileId: string) {
    return this.filesServices.deleteFile(+fileId);
  }
}
