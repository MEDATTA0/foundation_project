import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { SignInDto } from './dtos/signIn.dto';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/signUp.dto';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { changePasswordDto } from './dtos/changePassword.dto';

@ApiTags('Authentication')
@Controller('auth')
@AllowAnonymous()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: SignInDto })
  @Post('login')
  async login(@Body() dto: SignInDto) {
    return await this.authService.signIn(dto);
  }

  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'User registered' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiBody({ type: SignUpDto })
  @Post('register')
  async register(@Body() dto: SignUpDto) {
    return await this.authService.signUp(dto);
  }

  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ status: 200, description: 'Logged out' })
  @Get('logout')
  logout() {
    return null;
  }

  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({ status: 200, description: 'Password updated' })
  @ApiBody({ type: changePasswordDto })
  @Patch('update-password')
  async updatePassword(@Body() dto: changePasswordDto) {
    return await this.authService.updatePassword(dto);
  }
}
