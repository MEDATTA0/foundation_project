import { Test, TestingModule } from '@nestjs/testing';
import { ClassSessionsController } from './class-sessions.controller';
import { ClassSessionsService } from './class-sessions.service';

describe('ClassSessionsController', () => {
  let controller: ClassSessionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassSessionsController],
      providers: [ClassSessionsService],
    }).compile();

    controller = module.get<ClassSessionsController>(ClassSessionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
