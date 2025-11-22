import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import {
  CreateStudentDto,
  CreateStudentResponseDto,
} from './dto/create-student.dto';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UpdateStudentDto } from './dto/update-student.dto';
import { FindManyStudentResponseDto } from './dto/find-student.dto';

@ApiTags('Students')
@ApiBearerAuth('JWT-auth')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @ApiOperation({ summary: 'Create a student' })
  @ApiResponse({
    status: 201,
    description: 'Student created',
    type: CreateStudentResponseDto,
  })
  @ApiBody({ type: CreateStudentDto })
  @Post()
  create(
    @Body() createStudentDto: CreateStudentDto,
    @Session() session: UserSession,
  ) {
    const currentUserId = session.user.id;
    return this.studentsService.create(createStudentDto, currentUserId);
  }

  @ApiOperation({ summary: 'Get all students' })
  @ApiResponse({
    status: 200,
    description: 'Student list retrieved',
    type: FindManyStudentResponseDto,
    isArray: true,
  })
  @Get()
  findAll(@Session() session: UserSession) {
    const currentUserId = session.user.id;
    return this.studentsService.findAll(currentUserId);
  }

  @ApiOperation({ summary: 'Get student by ID' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({
    status: 200,
    description: 'Student retrieved',
    type: FindManyStudentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Get(':id')
  findOne(@Param('id') id: string, @Session() session: UserSession) {
    const currentUserId = session.user.id;
    return this.studentsService.findOne(id, currentUserId);
  }

  @ApiOperation({ summary: 'Update student info' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({
    status: 200,
    description: 'Student updated',
    type: FindManyStudentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiBody({ type: UpdateStudentDto })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
    @Session() session: UserSession,
  ) {
    const currentUserId = session.user.id;
    return this.studentsService.update(id, updateStudentDto, currentUserId);
  }

  @ApiOperation({ summary: 'Delete a student' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({ status: 200, description: 'Student deleted' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Delete(':id')
  remove(@Param('id') id: string, @Session() session: UserSession) {
    const currentUserId = session.user.id;
    return this.studentsService.remove(id, currentUserId);
  }
}
