import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  // Delete,
  Query,
} from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Attendances')
@ApiBearerAuth('JWT-auth')
@Controller('attendances')
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @ApiOperation({ summary: 'Record student attendance' })
  @ApiResponse({ status: 201, description: 'Attendance recorded' })
  @ApiBody({ type: CreateAttendanceDto })
  @Post()
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendancesService.create(createAttendanceDto);
  }

  @ApiOperation({ summary: 'Get attendance records' })
  @ApiQuery({
    name: 'classSessionId',
    required: true,
    description: 'Class session ID',
  })
  @ApiResponse({ status: 200, description: 'Attendance list retrieved' })
  @Get()
  findAll(@Query('classSessionId') classSessionId: string) {
    return this.attendancesService.findAll(classSessionId);
  }

  @ApiOperation({ summary: 'Get attendance by ID' })
  @ApiParam({ name: 'id', description: 'Attendance ID' })
  @ApiResponse({ status: 200, description: 'Attendance retrieved' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendancesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update attendance record' })
  @ApiParam({ name: 'id', description: 'Attendance ID' })
  @ApiBody({ type: UpdateAttendanceDto })
  @ApiResponse({ status: 200, description: 'Attendance updated' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ) {
    return this.attendancesService.update(id, updateAttendanceDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.attendancesService.remove(id);
  // }
}
