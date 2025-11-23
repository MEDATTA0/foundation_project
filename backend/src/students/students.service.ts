import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createStudentDto: CreateStudentDto, currentUserId: string) {
    const { name, birthDate } = createStudentDto;

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

    return this.prisma.student.create({
      data: {
        name,
        birthDate: new Date(birthDate),
        TeacherStudent: { create: { teacherId: teacher.id } },
      },
    });
  }

  async findAll(currentUserId: string) {
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

    return await this.prisma.teacherStudent.findMany({
      where: {
        teacherId: teacher.id,
      },
      include: {
        student: true,
      },
    });
  }

  async findOne(id: string, currentUserId: string) {
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

    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        Enrollment: {
          include: {
            class: true,
          },
        },
        TeacherStudent: { select: { teacherId: true } },
        _count: { select: { Attendance: true } },
      },
    });

    if (!student) throw new NotFoundException();
    const { teacherId } = student.TeacherStudent[0];
    if (teacherId !== teacher.id) throw new ForbiddenException();
    const attendance = await this.prisma.attendance.count({
      where: { present: true },
    });

    return { ...student, attendance, total: student._count.Attendance };
  }

  async update(
    studentId: string,
    updateStudentDto: UpdateStudentDto,
    currentUserId: string,
  ) {
    await this.findOne(studentId, currentUserId);

    return await this.prisma.student.update({
      where: { id: studentId },
      data: updateStudentDto,
    });
  }

  async remove(id: string, currentUserId: string) {
    await this.findOne(id, currentUserId);
    await this.prisma.student.delete({ where: { id } });
    return null;
  }
}
