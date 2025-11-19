import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClassSessionDto } from './dto/create-class-session.dto';
import { UpdateClassSessionDto } from './dto/update-class-session.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClassSessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createClassSessionDto: CreateClassSessionDto) {
    const { classId, duration, location, resources } = createClassSessionDto;
    const classSession = await this.prisma.classSession.create({
      data: { classId, duration, location, resources },
    });

    return classSession;
  }

  async findAll(classId: string) {
    return await this.prisma.classSession.findMany({
      where: { classId },
      include: { Attendance: true, class: true },
    });
  }

  async findOne(id: string) {
    const found = await this.prisma.classSession.findUnique({
      where: { id },
      include: { Attendance: true, class: true },
    });
    if (!found)
      throw new NotFoundException(`Class Session with id ${id} not found`);
    return found;
  }

  async update(id: string, updateClassSessionDto: UpdateClassSessionDto) {
    await this.findOne(id);

    const { duration, resources, location } = updateClassSessionDto;
    return this.prisma.classSession.update({
      where: { id },
      data: { duration, resources, location },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.classSession.delete({ where: { id } });
  }
}
