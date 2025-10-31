import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { authConfig } from 'better-auth.config';
@Module({
  imports: [BetterAuthModule.forRoot({ auth: authConfig })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
