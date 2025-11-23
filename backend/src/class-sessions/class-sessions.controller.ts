import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ClassSessionsService } from './class-sessions.service';
import { CreateClassSessionDto } from './dto/create-class-session.dto';
import { UpdateClassSessionDto } from './dto/update-class-session.dto';
import {
  ClassSessionResponseDto,
  ClassSessionWithDetailsResponseDto,
} from './dto/class-session-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Class Sessions')
@ApiBearerAuth('JWT-auth')
@Controller('class-sessions')
export class ClassSessionsController {
  constructor(private readonly classSessionsService: ClassSessionsService) {}

  @ApiOperation({ summary: 'Create a class session' })
  @ApiResponse({
    status: 201,
    description: 'Session created',
    type: ClassSessionResponseDto,
  })
  @ApiBody({ type: CreateClassSessionDto })
  @Post()
  create(@Body() createClassSessionDto: CreateClassSessionDto) {
    return this.classSessionsService.create(createClassSessionDto);
  }

  @ApiOperation({ summary: 'Get all class sessions' })
  @ApiQuery({ name: 'classId', required: true, description: 'Filter by class' })
  @ApiResponse({
    status: 200,
    description: 'Session list retrieved',
    type: [ClassSessionWithDetailsResponseDto],
  })
  @Get()
  findAll(@Query('classId') classId: string) {
    return this.classSessionsService.findAll(classId);
  }

  @ApiOperation({ summary: 'Get session by ID' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({
    status: 200,
    description: 'Session retrieved',
    type: ClassSessionWithDetailsResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classSessionsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a class session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiBody({ type: UpdateClassSessionDto })
  @ApiResponse({
    status: 200,
    description: 'Session updated',
    type: ClassSessionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClassSessionDto: UpdateClassSessionDto,
  ) {
    return this.classSessionsService.update(id, updateClassSessionDto);
  }

  @ApiOperation({ summary: 'Delete a class session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({
    status: 200,
    description: 'Session deleted',
    type: ClassSessionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classSessionsService.remove(id);
  }
}
