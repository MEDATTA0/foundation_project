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

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  create(
    @Body() createEnrollmentDto: CreateEnrollmentDto,
    @Session() session: UserSession,
  ) {
    const currentUserId = session.user.id;
    return this.enrollmentsService.create(createEnrollmentDto, currentUserId);
  }

  @Get()
  findAll(@Query() studentId: string) {
    return this.enrollmentsService.findAll(studentId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enrollmentsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Session() session: UserSession) {
    const currentUserId = session.user.id;
    return this.enrollmentsService.remove(id, currentUserId);
  }
}
