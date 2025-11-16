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
    description: 'The name of the class',
    example: 'Mathematics 101',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The start date of the class',
    example: '2024-01-15T00:00:00.000Z',
  })
  @IsDateString()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({
    description: 'The end date of the class',
    example: '2024-06-15T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  endDate?: Date;
}
