import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEnrollmentDto {
  @ApiProperty({
    description: 'Student ID',
    example: 'student-uuid-123',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Class ID',
    example: 'class-uuid-456',
  })
  @IsString()
  @IsNotEmpty()
  classId: string;
}

export class CreateEnrollmentResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  classId: string;
  @ApiProperty()
  studentId: string;
  @ApiProperty()
  createdAt: string;
  @ApiProperty()
  updatedAT: string;
}
