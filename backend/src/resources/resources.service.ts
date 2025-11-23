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

  private async verifyClassOwnership(classId: string, currentUserId: string) {
    const classroom = await this.prisma.class.findUnique({
      where: { id: classId },
    });

    if (!classroom) {
      throw new NotFoundException('Class not found');
    }

    if (classroom.teacherId !== currentUserId) {
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
    const data = createResourceDto.resources.map((res) => ({
      classId,
      resource: res,
    }));

    await this.prisma.resource.createMany({
      data,
      skipDuplicates: true,
    });
    return await this.prisma.resource.findMany({
      where: { classId },
    });
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
}
