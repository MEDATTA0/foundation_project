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
    const newClassroom = await this.prisma.class.create({
      data: { ...createClassDto, teacherId: currentUserId },
    });
    return newClassroom;
  }

  async findAll(currentUserId: string) {
    return await this.prisma.class.findMany({
      where: { teacherId: currentUserId },
    });
  }

  async findOne(classId: string, currentUserId: string) {
    const classroom = await this.prisma.class.findUnique({
      where: { id: classId },
    });
    if (!classroom) throw new NotFoundException();
    if (classroom.teacherId !== currentUserId) throw new ForbiddenException();
    return classroom;
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
