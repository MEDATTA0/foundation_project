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
    const response = await this.betterAuthService.api.signUpEmail({
      body: dto,
    });

    return response;
  }

  // async logout(token: string) {
  //   const response = await this.betterAuthService.api.revokeSession({
  //     body: { token },
  //     method: 'POST',
  //     headers:
  //   });
  //   return response;
  // }
}
