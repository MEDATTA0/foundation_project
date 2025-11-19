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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Classes')
@ApiBearerAuth('JWT-auth')
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @ApiOperation({ summary: 'Create a class' })
  @ApiResponse({ status: 201, description: 'Class created' })
  @ApiBody({ type: CreateClassDto })
  @Post()
  create(
    @Body() createClassDto: CreateClassDto,
    @Session() session: UserSession,
  ) {
    const currentUserId = session.user.id;
    return this.classesService.create(createClassDto, currentUserId);
  }

  @ApiOperation({ summary: 'Get all classes' })
  @ApiResponse({ status: 200, description: 'Class list retrieved' })
  @Get()
  findAll(@Session() session: UserSession) {
    const currentUserId = session.user.id;
    return this.classesService.findAll(currentUserId);
  }

  @ApiOperation({ summary: 'Get class by ID' })
  @ApiParam({ name: 'id', description: 'Class ID' })
  @ApiResponse({ status: 200, description: 'Class retrieved' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Get(':id')
  findOne(@Param('id') id: string, @Session() session: UserSession) {
    const currentUserId = session.user.id;
    return this.classesService.findOne(id, currentUserId);
  }

  @ApiOperation({ summary: 'Update a class' })
  @ApiParam({ name: 'id', description: 'Class ID' })
  @ApiBody({ type: UpdateClassDto })
  @ApiResponse({ status: 200, description: 'Class updated' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassDto,
    @Session() session: UserSession,
  ) {
    const currentUserId = session.user.id;
    return this.classesService.update(id, currentUserId, updateClassDto);
  }

  @ApiOperation({ summary: 'Delete a class' })
  @ApiParam({ name: 'id', description: 'Class ID' })
  @ApiResponse({ status: 200, description: 'Class deleted' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Delete(':id')
  remove(@Param('id') id: string, @Session() session: UserSession) {
    const currentUserId = session.user.id;
    return this.classesService.remove(id, currentUserId);
  }
}
