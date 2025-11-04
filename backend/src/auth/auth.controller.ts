import { Body, Controller, Get, Post } from '@nestjs/common';
import { SignInDto } from './dtos/signIn.dto';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/signUp.dto';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@AllowAnonymous()
@Controller('auth')
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

  @Get('logout')
  logout() {
    return null;
  }
}
