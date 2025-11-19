import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async dashboard(currentUserId: string) {
    const classes = await this.prisma.class.findMany({
      where: { teacherId: currentUserId },
      select: { id: true },
    });
    const classIds = classes.map((cls) => cls.id);
    const [students, resources, classSessions] = await Promise.all([
      this.prisma.teacherStudent.count({ where: { teacherId: currentUserId } }),
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
