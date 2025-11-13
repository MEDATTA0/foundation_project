import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { ClassesService } from 'src/classes/classes.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EnrollmentsService {
  constructor(
    private readonly classService: ClassesService,
    private readonly prisma: PrismaService,
  ) {}

  async create(
    createEnrollmentDto: CreateEnrollmentDto,
    currentUserId: string,
  ) {
    const { classId, studentId } = createEnrollmentDto;
    await this.classService.findOne(classId, currentUserId);
    const newEnrollment = await this.prisma.enrollment.create({
      data: { classId, studentId },
    });
    return newEnrollment;
  }

  async findAll(studentId: string) {
    return await this.prisma.enrollment.findMany({ where: { studentId } });
  }

  async findOne(id: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id },
      include: { class: true },
    });
    if (!enrollment) throw new NotFoundException();
    return enrollment;
  }

  async remove(enrollmentId: string, currentUserId: string) {
    const enrollment = await this.findOne(enrollmentId);
    if (enrollment.class.teacherId !== currentUserId)
      throw new ForbiddenException();

    await this.prisma.enrollment.delete({ where: { id: enrollmentId } });
    return null;
  }
}
