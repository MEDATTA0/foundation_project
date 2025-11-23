import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClassesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createClassDto: CreateClassDto, currentUserId: string) {
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

    const newClassroom = await this.prisma.class.create({
      data: {
        name: createClassDto.name,
        description: createClassDto.description,
        startDate: new Date(createClassDto.startDate),
        endDate: createClassDto.endDate
          ? new Date(createClassDto.endDate)
          : null,
        ageMin: createClassDto.ageMin,
        ageMax: createClassDto.ageMax,
        teacherId: teacher.id,
      },
    });
    return newClassroom;
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

    const classes = await this.prisma.class.findMany({
      where: { teacherId: teacher.id },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        Enrollment: {
          select: {
            id: true,
          },
        },
        Resource: {
          select: {
            id: true,
          },
        },
      },
    });

    // Transform to match frontend expectations
    return classes.map((cls) => ({
      id:
        typeof cls.id === 'string' || typeof cls.id === 'number' ? cls.id : '',
      name: typeof cls.name === 'string' ? cls.name : '',
      description: typeof cls.description === 'string' ? cls.description : '',
      ageRange: {
        min: typeof cls.ageMin === 'number' ? cls.ageMin : 0,
        max: typeof cls.ageMax === 'number' ? cls.ageMax : 0,
      },
      studentCount: cls.Enrollment.length,
      resourceCount: cls.Resource.length,
      teacherName: cls.teacher?.user?.name,
      createdAt: cls.createdAt,
    }));
  }

  async findOne(classId: string, currentUserId: string) {
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

    const classroom = await this.prisma.class.findUnique({
      where: { id: classId },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        Enrollment: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                birthDate: true,
              },
            },
          },
        },
        Resource: {
          select: {
            id: true,
          },
        },
      },
    });
    if (!classroom) throw new NotFoundException();
    if (classroom.teacherId !== teacher.id) throw new ForbiddenException();

    // Transform to match frontend expectations
    return {
      id: classroom.id,
      name: classroom.name,
      description: classroom.description || '',
      ageRange: {
        min: classroom.ageMin || 0,
        max: classroom.ageMax || 0,
      },
      studentCount: classroom.Enrollment.length,
      resourceCount: classroom.Resource.length,
      teacherName: classroom.teacher?.user?.name,
      createdAt: classroom.createdAt,
      startDate: classroom.startDate,
      endDate: classroom.endDate,
      students: classroom.Enrollment.map((enrollment) => ({
        id: enrollment.student.id,
        name: enrollment.student.name,
        birthDate: enrollment.student.birthDate,
        enrollmentId: enrollment.id,
      })),
    };
  }

  async update(
    classId: string,
    currentUserId: string,
    updateClassDto: UpdateClassDto,
  ) {
    await this.findOne(classId, currentUserId);
    const updatedClassroom = await this.prisma.class.update({
      where: { id: classId },
      data: { ...updateClassDto },
    });
    return updatedClassroom;
  }

  async remove(classId: string, currentUserId: string) {
    await this.findOne(classId, currentUserId);
    await this.prisma.class.delete({ where: { id: classId } });
    return null;
  }
}
