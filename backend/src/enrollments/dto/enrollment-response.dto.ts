import { ApiProperty } from '@nestjs/swagger';

export class EnrollmentResponseDto {
  @ApiProperty({
    description: 'Enrollment ID',
    example: 'enrollment-uuid-123',
  })
  id: string;

  @ApiProperty({
    description: 'Student ID',
    example: 'student-uuid-456',
  })
  studentId: string;

  @ApiProperty({
    description: 'Class ID',
    example: 'class-uuid-789',
  })
  classId: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-15T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-15T10:00:00.000Z',
  })
  updatedAt: Date;
}

class Class {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  startDate: Date;
  @ApiProperty()
  endDate: Date | null;
  @ApiProperty()
  teacherId: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
export class EnrollmentWithClassResponseDto extends EnrollmentResponseDto {
  @ApiProperty({
    description: 'Class information',
    type: Class,
    isArray: true,
  })
  class: Class[];
}
