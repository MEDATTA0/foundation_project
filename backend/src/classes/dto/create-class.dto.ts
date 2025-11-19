import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClassDto {
  @ApiProperty({
    description: 'Class name',
    example: 'Mathematics 101',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Class start date',
    example: '2024-01-15T00:00:00.000Z',
  })
  @IsDateString()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({
    description: 'Class end date',
    example: '2024-06-15T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  endDate?: Date;
}
