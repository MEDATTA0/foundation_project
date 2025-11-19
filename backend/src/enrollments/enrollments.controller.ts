import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Enrollments')
@ApiBearerAuth('JWT-auth')
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @ApiOperation({ summary: 'Enroll student in class' })
  @ApiResponse({ status: 201, description: 'Enrollment created' })
  @ApiBody({ type: CreateEnrollmentDto })
  @Post()
  create(
    @Body() createEnrollmentDto: CreateEnrollmentDto,
    @Session() session: UserSession,
  ) {
    const currentUserId = session.user.id;
    return this.enrollmentsService.create(createEnrollmentDto, currentUserId);
  }

  @ApiOperation({ summary: 'Get all enrollments' })
  @ApiQuery({
    name: 'studentId',
    required: false,
    description: 'Filter by student',
  })
  @ApiResponse({ status: 200, description: 'Enrollment list retrieved' })
  @Get()
  findAll(@Query() studentId: string) {
    return this.enrollmentsService.findAll(studentId);
  }

  @ApiOperation({ summary: 'Get enrollment by ID' })
  @ApiParam({ name: 'id', description: 'Enrollment ID' })
  @ApiResponse({ status: 200, description: 'Enrollment retrieved' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enrollmentsService.findOne(id);
  }

  @ApiOperation({ summary: 'Remove enrollment' })
  @ApiParam({ name: 'id', description: 'Enrollment ID' })
  @ApiResponse({ status: 200, description: 'Enrollment deleted' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Delete(':id')
  remove(@Param('id') id: string, @Session() session: UserSession) {
    const currentUserId = session.user.id;
    return this.enrollmentsService.remove(id, currentUserId);
  }
}
