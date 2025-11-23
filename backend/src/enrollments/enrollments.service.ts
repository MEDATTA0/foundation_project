import {
  ConflictException,
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

    // Check if student is already enrolled in this class
    const existingEnrollment = await this.prisma.enrollment.findFirst({
      where: {
        classId,
        studentId,
      },
    });

    if (existingEnrollment) {
      throw new ConflictException('Student is already enrolled in this class');
    }

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
    // Find or create the teacher record for this user
    let teacher = await this.prisma.teacher.findFirst({
      where: { userId: currentUserId },
    });

    // If teacher doesn't exist, create it
    if (!teacher) {
      teacher = await this.prisma.teacher.create({
        data: { userId: currentUserId },
      });
    }

    const enrollment = await this.findOne(enrollmentId);
    if (enrollment.class.teacherId !== teacher.id)
      throw new ForbiddenException();

    await this.prisma.enrollment.delete({ where: { id: enrollmentId } });
    return null;
  }
}
