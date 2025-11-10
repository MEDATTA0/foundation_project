import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  create(
    @Body() createClassDto: CreateClassDto,
    @Session() session: UserSession,
  ) {
    const currentUserId = session.user.id;
    return this.classesService.create(createClassDto, currentUserId);
  }

  @Get()
  findAll(@Session() session: UserSession) {
    const currentUserId = session.user.id;
    return this.classesService.findAll(currentUserId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Session() session: UserSession) {
    const currentUserId = session.user.id;
    return this.classesService.findOne(id, currentUserId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassDto,
    @Session() session: UserSession,
  ) {
    const currentUserId = session.user.id;
    return this.classesService.update(id, currentUserId, updateClassDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Session() session: UserSession) {
    const currentUserId = session.user.id;
    return this.classesService.remove(id, currentUserId);
  }
}
