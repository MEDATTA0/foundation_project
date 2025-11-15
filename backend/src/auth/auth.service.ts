import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dtos/signUp.dto';
import { AuthService as BetterAuthService } from '@thallesp/nestjs-better-auth';
import { SignInDto } from './dtos/signIn.dto';

@Injectable()
export class AuthService {
  constructor(private readonly betterAuthService: BetterAuthService) {}

  async signIn(dto: SignInDto) {
    const response = await this.betterAuthService.api.signInEmail({
      body: dto,
    });
    return response;
  }

  async signUp(dto: SignUpDto) {
    const { email, name, password } = dto;
    const response = await this.betterAuthService.api.signUpEmail({
      body: { email, name, password },
    });

    return response;
  }

  async updateUser(dto: { name: string }) {
    const { name } = dto;
    const response = await this.betterAuthService.api.updateUser({
      body: { name },
    });

    return response;
  }

  async updatePassword(dto: { currentPassword: string; newPassword: string }) {
    const { currentPassword, newPassword } = dto;
    const response = await this.betterAuthService.api.changePassword({
      body: { currentPassword, newPassword, revokeOtherSessions: true },
    });

    return response;
  }
}