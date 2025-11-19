import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import {
  AuthGuard,
  Session,
  type UserSession,
} from '@thallesp/nestjs-better-auth';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(AuthGuard)
  @Get('/dashboard')
  getDashboard(@Session() session: UserSession) {
    const currentUserId = session.user.id;
    return this.appService.dashboard(currentUserId);
  }
}
