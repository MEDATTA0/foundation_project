import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEnrollmentDto {
  @ApiProperty({
    description: 'The ID of the student to enroll',
    example: 'student-uuid-123',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'The ID of the class to enroll the student in',
    example: 'class-uuid-456',
  })
  @IsString()
  @IsNotEmpty()
  classId: string;
}
