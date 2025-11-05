import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { SignInDto } from './dtos/signIn.dto';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/signUp.dto';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import type { Request, Response } from 'express';

@Controller('auth')
@AllowAnonymous()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  login(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @Post('register')
  register(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }
  // @Post('register')
  // async signUp(
  //   @Body() body: SignUpDto,
  //   @Req() req: Request,
  //   @Res({ passthrough: true }) res: Response,
  // ) {
  //   return this.authService.signUp(body, req, res);
  // }

  // @Post('login')
  // async login(
  //   @Body() body: SignInDto,
  //   @Req() req: Request,
  //   @Res({ passthrough: true }) res: Response,
  // ) {
  //   return this.authService.signIn(body, req, res);
  // }

  @Get('logout')
  logout() {
    return null;
  }
}
