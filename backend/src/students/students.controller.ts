import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
// import { UpdateStudentDto } from './dto/update-student.dto';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  create(
    @Body() createStudentDto: CreateStudentDto,
    @Session() session: UserSession,
  ) {
    const currentUserId = session.user.id;
    return this.studentsService.create(createStudentDto, currentUserId);
  }

  @Get()
  findAll(@Session() session: UserSession) {
    const currentUserId = session.user.id;
    return this.studentsService.findAll(currentUserId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Session() session: UserSession) {
    const currentUserId = session.user.id;
    return this.studentsService.findOne(id, currentUserId);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
  //   return this.studentsService.update(id, updateStudentDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string, @Session() session: UserSession) {
    const currentUserId = session.user.id;
    return this.studentsService.remove(id, currentUserId);
  }
}
