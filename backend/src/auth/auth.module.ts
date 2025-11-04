import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
@Module({
  imports: [BetterAuthModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
