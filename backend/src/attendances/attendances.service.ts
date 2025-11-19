import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AttendancesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAttendanceDto: CreateAttendanceDto) {
    const { present, classSessionId, studentId } = createAttendanceDto;
    return await this.prisma.attendance.create({
      data: { present, studentId, classSessionId },
    });
  }

  async findAll(classSessionId: string) {
    return await this.prisma.attendance.findMany({
      where: { classSessionId },
      include: { student: true },
    });
  }

  async findOne(id: string) {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id },
    });
    if (!attendance) throw new NotFoundException();
    return attendance;
  }

  async update(id: string, updateAttendanceDto: UpdateAttendanceDto) {
    await this.findOne(id);
    const { present } = updateAttendanceDto;
    const updated = await this.prisma.attendance.update({
      where: { id },
      data: { present },
    });
    return updated;
  }

  // remove(id: number) {
  //   return `This action removes a #${id} attendance`;
  // }
}
