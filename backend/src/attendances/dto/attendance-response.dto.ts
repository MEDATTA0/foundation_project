import { ApiProperty } from '@nestjs/swagger';

export class AttendanceResponseDto {
  @ApiProperty({
    description: 'Attendance ID',
    example: 'attendance-uuid-123',
  })
  id: string;

  @ApiProperty({
    description: 'Class session ID',
    example: 'session-uuid-123',
  })
  classSessionId: string;

  @ApiProperty({
    description: 'Student ID',
    example: 'student-uuid-456',
  })
  studentId: string;

  @ApiProperty({
    description: 'Whether student was present',
    example: true,
  })
  present: boolean;

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

class Student {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  birthDate: Date;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}

export class AttendanceWithStudentResponseDto extends AttendanceResponseDto {
  @ApiProperty({
    description: 'Student information',
    isArray: true,
    type: Student,
  })
  student: Student;
}
