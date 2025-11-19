import { Test, TestingModule } from '@nestjs/testing';
import { ClassSessionsTsController } from './class-sessions.ts.controller';
import { ClassSessionsTsService } from './class-sessions.ts.service';

describe('ClassSessionsTsController', () => {
  let controller: ClassSessionsTsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassSessionsTsController],
      providers: [ClassSessionsTsService],
    }).compile();

    controller = module.get<ClassSessionsTsController>(ClassSessionsTsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
