import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Resource } from './entities/resource.entity';

@ApiTags('Resources')
@ApiBearerAuth('JWT-auth')
@Controller('classes/:classId/resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @ApiOperation({ summary: 'Create a resource for a class' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiBody({ type: CreateResourceDto })
  @ApiResponse({
    status: 201,
    description: 'Resource created',
    type: Resource,
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Not your class' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  @Post()
  create(
    @Param('classId') classId: string,
    @Body() createResourceDto: CreateResourceDto,
    @Session() session: UserSession,
  ) {
    const currentUserId = session.user.id;
    return this.resourcesService.create(
      classId,
      createResourceDto,
      currentUserId,
    );
  }

  @ApiOperation({ summary: 'Get all resources for a class' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiResponse({
    status: 200,
    description: 'Resources retrieved',
    type: [Resource],
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Not your class' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  @Get()
  findAll(@Param('classId') classId: string, @Session() session: UserSession) {
    const currentUserId = session.user.id;
    return this.resourcesService.findAll(classId, currentUserId);
  }

  @ApiOperation({ summary: 'Get a specific resource' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiParam({ name: 'id', description: 'Resource ID' })
  @ApiResponse({
    status: 200,
    description: 'Resource retrieved',
    type: Resource,
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Not your class' })
  @ApiResponse({ status: 404, description: 'Resource or class not found' })
  @Get(':id')
  findOne(
    @Param('classId') classId: string,
    @Param('id') id: string,
    @Session() session: UserSession,
  ) {
    const currentUserId = session.user.id;
    return this.resourcesService.findOne(classId, id, currentUserId);
  }

  @ApiOperation({ summary: 'Update a resource' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiParam({ name: 'id', description: 'Resource ID' })
  @ApiBody({ type: UpdateResourceDto })
  @ApiResponse({
    status: 200,
    description: 'Resource updated',
    type: Resource,
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Not your class' })
  @ApiResponse({ status: 404, description: 'Resource or class not found' })
  @Patch(':id')
  update(
    @Param('classId') classId: string,
    @Param('id') id: string,
    @Body() updateResourceDto: UpdateResourceDto,
    @Session() session: UserSession,
  ) {
    const currentUserId = session.user.id;
    return this.resourcesService.update(
      classId,
      id,
      updateResourceDto,
      currentUserId,
    );
  }

  @ApiOperation({ summary: 'Delete a resource' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiParam({ name: 'id', description: 'Resource ID' })
  @ApiResponse({ status: 200, description: 'Resource deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not your class' })
  @ApiResponse({ status: 404, description: 'Resource or class not found' })
  @Delete(':id')
  remove(
    @Param('classId') classId: string,
    @Param('id') id: string,
    @Session() session: UserSession,
  ) {
    const currentUserId = session.user.id;
    return this.resourcesService.remove(classId, id, currentUserId);
  }
}
