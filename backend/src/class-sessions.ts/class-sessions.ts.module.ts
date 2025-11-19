import { Module } from '@nestjs/common';
import { ClassSessionsTsService } from './class-sessions.ts.service';
import { ClassSessionsTsController } from './class-sessions.ts.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ClassSessionsTsController],
  providers: [ClassSessionsTsService],
})
export class ClassSessionsTsModule {}
