import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import {
  AuthGuard,
  Session,
  type UserSession,
} from '@thallesp/nestjs-better-auth';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({ status: 200, description: 'API is running' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiOperation({ summary: 'Get dashboard data' })
  @ApiResponse({ status: 200, description: 'Dashboard retrieved' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard)
  @Get('/dashboard')
  getDashboard(@Session() session: UserSession) {
    const currentUserId = session.user.id;
    return this.appService.dashboard(currentUserId);
  }
}
