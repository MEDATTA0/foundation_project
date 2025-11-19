import { Test, TestingModule } from '@nestjs/testing';
import { ClassSessionsTsService } from './class-sessions.ts.service';

describe('ClassSessionsTsService', () => {
  let service: ClassSessionsTsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassSessionsTsService],
    }).compile();

    service = module.get<ClassSessionsTsService>(ClassSessionsTsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
