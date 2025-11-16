import { Module } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ClassesModule } from 'src/classes/classes.module';

@Module({
  imports: [PrismaModule, ClassesModule],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
})
export class EnrollmentsModule {}
