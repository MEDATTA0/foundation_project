import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  Max,
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
    description: 'Class description',
    example: 'Introduction to basic mathematics concepts',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Class start date',
    example: '2024-01-15T00:00:00.000Z',
  })
  @IsDateString(
    {},
    { message: 'startDate must be a valid ISO 8601 date string' },
  )
  startDate: string;

  @ApiProperty({
    description: 'Class end date',
    example: '2024-06-15T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'endDate must be a valid ISO 8601 date string' })
  endDate?: string;

  @ApiProperty({
    description: 'Minimum age for students',
    example: 4,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  ageMin?: number;

  @ApiProperty({
    description: 'Maximum age for students',
    example: 6,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  ageMax?: number;
}
