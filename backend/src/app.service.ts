import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async dashboard(currentUserId: string) {
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
      select: { id: true },
    });
    const classIds = classes.map((cls) => cls.id);
    const [students, resources, classSessions] = await Promise.all([
      this.prisma.teacherStudent.count({ where: { teacherId: teacher.id } }),
      this.prisma.resource.count({ where: { classId: { in: classIds } } }),
      this.prisma.classSession.findMany({
        where: { classId: { in: classIds } },
        take: 5,
      }),
    ]);

    return {
      students,
      resources,
      classrooms: classes.length,
      recentSessions: classSessions,
    };
  }
}
