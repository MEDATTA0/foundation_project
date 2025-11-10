import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  @Type(() => Date)
  startDate: Date;

  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  endDate?: Date;
}
