import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ResourcesService {
  constructor(private readonly prisma: PrismaService) {}

  private async getTeacherFromUserId(currentUserId: string) {
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

    return teacher;
  }

  private async verifyClassOwnership(classId: string, currentUserId: string) {
    const teacher = await this.getTeacherFromUserId(currentUserId);

    const classroom = await this.prisma.class.findUnique({
      where: { id: classId },
    });

    if (!classroom) {
      throw new NotFoundException('Class not found');
    }

    if (classroom.teacherId !== teacher.id) {
      throw new ForbiddenException('You do not own this class');
    }

    return classroom;
  }

  async create(
    classId: string,
    createResourceDto: CreateResourceDto,
    currentUserId: string,
  ) {
    await this.verifyClassOwnership(classId, currentUserId);

    const newResource = await this.prisma.resource.create({
      data: {
        classId,
        title: createResourceDto.title,
        description: createResourceDto.description,
        resource: createResourceDto.resource,
        ageMin: createResourceDto.ageMin,
        ageMax: createResourceDto.ageMax,
      },
    });

    return newResource;
  }

  async findAll(classId: string, currentUserId: string) {
    await this.verifyClassOwnership(classId, currentUserId);

    return await this.prisma.resource.findMany({
      where: { classId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(classId: string, resourceId: string, currentUserId: string) {
    await this.verifyClassOwnership(classId, currentUserId);

    const resource = await this.prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    if (resource.classId !== classId) {
      throw new ForbiddenException('Resource does not belong to this class');
    }

    return resource;
  }

  async update(
    classId: string,
    resourceId: string,
    updateResourceDto: UpdateResourceDto,
    currentUserId: string,
  ) {
    await this.findOne(classId, resourceId, currentUserId);

    const updatedResource = await this.prisma.resource.update({
      where: { id: resourceId },
      data: { ...updateResourceDto },
    });

    return updatedResource;
  }

  async remove(classId: string, resourceId: string, currentUserId: string) {
    await this.findOne(classId, resourceId, currentUserId);

    await this.prisma.resource.delete({ where: { id: resourceId } });

    return null;
  }

  /**
   * Get all resources for a teacher across all their classes
   * This is useful for displaying a resource library
   */
  async findAllForTeacher(currentUserId: string) {
    const teacher = await this.getTeacherFromUserId(currentUserId);

    // Get all classes for this teacher
    const classes = await this.prisma.class.findMany({
      where: { teacherId: teacher.id },
      select: { id: true, name: true },
    });

    const classIds = classes.map((cls) => cls.id);

    // Get all resources for these classes
    const resources = await this.prisma.resource.findMany({
      where: { classId: { in: classIds } },
      include: {
        class: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform to include age range
    return resources.map((resource) => ({
      ...resource,
      ageRange:
        resource.ageMin !== null && resource.ageMax !== null
          ? { min: resource.ageMin, max: resource.ageMax }
          : null,
    }));
  }
}
