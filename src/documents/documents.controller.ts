import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Auth } from 'src/users/decorators/auth.decorator';
import { GetUser } from 'src/users/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @Auth()
  create(@GetUser() user: User, @Body() createDocumentDto: CreateDocumentDto) {
    return this.documentsService.create(user, createDocumentDto);
  }

  @Get('/')
  @Auth()
  findAllByUser(@GetUser() user: User) {
    return this.documentsService.findAllByUser(user);
  }

  @Get('/public')
  findAllPublic() {
    return this.documentsService.findAllPublic();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.documentsService.update(+id, updateDocumentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentsService.remove(+id);
  }
}
