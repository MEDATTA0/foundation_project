import { Controller, Get } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Resource } from './entities/resource.entity';

/**
 * Controller for teacher's resource library
 * This allows fetching all resources without requiring a classId
 */
@ApiTags('Resources')
@ApiBearerAuth('JWT-auth')
@Controller('resources')
export class ResourcesLibraryController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @ApiOperation({
    summary: 'Get all resources for the current teacher (across all classes)',
    description:
      'Fetches all resources from all classes owned by the current teacher. Useful for displaying a resource library.',
  })
  @ApiResponse({
    status: 200,
    description: 'All resources retrieved',
    type: [Resource],
  })
  @Get()
  findAllForTeacher(@Session() session: UserSession) {
    const currentUserId = session.user.id;
    return this.resourcesService.findAllForTeacher(currentUserId);
  }
}
