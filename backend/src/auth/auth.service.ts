import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dtos/signUp.dto';
import { AuthService as BetterAuthService } from '@thallesp/nestjs-better-auth';
import { SignInDto } from './dtos/signIn.dto';
import { Request, Response } from 'express';
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

  // async signUp(body: SignUpDto, req: Request, res: Response) {
  //   const { email, name, password } = body;
  //   const response = await this.betterAuthService.api.signUpEmail({
  //     body: { email, name, password },
  //     asResponse: true,
  //     headers: req.headers as Record<string, string>,
  //   });

  //   // Copy cookies from better-auth response to Nest.js response
  //   if (response.headers && response.headers.get('set-cookie')) {
  //     const cookieHeader = response.headers.get('set-cookie');
  //     if (cookieHeader) {
  //       res.header('set-cookie', cookieHeader);
  //     }
  //   }

  //   // Read and return the response body
  //   const responseData = (await response.json()) as {
  //     user?: any;
  //     session?: any;
  //   };
  //   return responseData;
  // }

  // async signIn(body: SignInDto, req: Request, res: Response) {
  //   const { email, password, rememberMe } = body;
  //   const response = await this.betterAuthService.api.signInEmail({
  //     body: { email, password, rememberMe },
  //     asResponse: true,
  //     headers: req.headers as Record<string, string>,
  //   });

  //   // return response;
  //   if (response.headers && response.headers.get('set-cookie')) {
  //     const cookieHeader = response.headers.get('set-cookie');
  //     if (cookieHeader) {
  //       res.header('set-cookie', cookieHeader);
  //     }
  //   }

  //   const responseBody = (await response.json()) as Record<string, any>;
  //   return responseBody;
  // }
}
