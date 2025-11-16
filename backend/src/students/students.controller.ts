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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Students')
@ApiBearerAuth('JWT-auth')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @ApiOperation({ summary: 'Create a new student' })
  @ApiResponse({
    status: 201,
    description: 'Student created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        birthDate: { type: 'string', format: 'date' },
        teacherId: { type: 'string' },
      },
    },
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

  @ApiOperation({ summary: 'Get all students for current teacher' })
  @ApiResponse({
    status: 200,
    description: 'List of students retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          birthDate: { type: 'string', format: 'date' },
          teacherId: { type: 'string' },
        },
      },
    },
  })
  @Get()
  findAll(@Session() session: UserSession) {
    const currentUserId = session.user.id;
    return this.studentsService.findAll(currentUserId);
  }

  @ApiOperation({ summary: 'Get a student by ID' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({
    status: 200,
    description: 'Student retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        birthDate: { type: 'string', format: 'date' },
        teacherId: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Student not found' })
  @Get(':id')
  findOne(@Param('id') id: string, @Session() session: UserSession) {
    const currentUserId = session.user.id;
    return this.studentsService.findOne(id, currentUserId);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
  //   return this.studentsService.update(id, updateStudentDto);
  // }

  @ApiOperation({ summary: 'Delete a student' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({
    status: 200,
    description: 'Student deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Student not found' })
  @Delete(':id')
  remove(@Param('id') id: string, @Session() session: UserSession) {
    const currentUserId = session.user.id;
    return this.studentsService.remove(id, currentUserId);
  }
}
