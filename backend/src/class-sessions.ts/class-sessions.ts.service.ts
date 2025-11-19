import { Injectable } from '@nestjs/common';
import { CreateClassSessionsTDto } from './dto/create-class-sessions.t.dto';
import { UpdateClassSessionsTDto } from './dto/update-class-sessions.t.dto';

@Injectable()
export class ClassSessionsTsService {
  create(createClassSessionsTDto: CreateClassSessionsTDto) {
    return 'This action adds a new classSessionsT';
  }

  findAll() {
    return `This action returns all classSessionsTs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} classSessionsT`;
  }

  update(id: number, updateClassSessionsTDto: UpdateClassSessionsTDto) {
    return `This action updates a #${id} classSessionsT`;
  }

  remove(id: number) {
    return `This action removes a #${id} classSessionsT`;
  }
}
