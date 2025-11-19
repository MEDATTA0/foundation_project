import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateClassSessionDto {
  @ApiProperty({
    description: 'Class ID',
    example: 'class-uuid-123',
  })
  @IsString()
  @IsNotEmpty()
  classId: string;

  @ApiProperty({
    description: 'Session duration in minutes',
    example: 45,
  })
  @IsNumber()
  @Type(() => Number)
  duration: number;

  @ApiProperty({
    description: 'Session location',
    example: 'Room 101',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: 'Session resources',
    example: 'https://docs.example.com/lesson1',
    required: false,
  })
  @IsOptional()
  @IsString()
  resources?: string;
}
