import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClassSessionsTsService } from './class-sessions.ts.service';
import { CreateClassSessionsTDto } from './dto/create-class-sessions.t.dto';
import { UpdateClassSessionsTDto } from './dto/update-class-sessions.t.dto';

@Controller('class-sessions.ts')
export class ClassSessionsTsController {
  constructor(private readonly classSessionsTsService: ClassSessionsTsService) {}

  @Post()
  create(@Body() createClassSessionsTDto: CreateClassSessionsTDto) {
    return this.classSessionsTsService.create(createClassSessionsTDto);
  }

  @Get()
  findAll() {
    return this.classSessionsTsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classSessionsTsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassSessionsTDto: UpdateClassSessionsTDto) {
    return this.classSessionsTsService.update(+id, updateClassSessionsTDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classSessionsTsService.remove(+id);
  }
}
