import { OmitType } from '@nestjs/swagger';
import { CreateClassDto } from './create-class.dto';

export class UpdateClassDto extends OmitType(CreateClassDto, [
  'startDate',
] as const) {}
