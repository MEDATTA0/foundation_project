import { ApiProperty } from '@nestjs/swagger';

export class ClassSessionResponseDto {
  @ApiProperty({
    description: 'Class session ID',
    example: 'session-uuid-123',
  })
  id: string;

  @ApiProperty({
    description: 'Class ID',
    example: 'class-uuid-456',
  })
  classId: string;

  @ApiProperty({
    description: 'Session duration in minutes',
    example: 45,
  })
  duration: number;

  @ApiProperty({
    description: 'Session location',
    example: 'Room 101',
    required: false,
  })
  location?: string;

  @ApiProperty({
    description: 'Session resources',
    example: 'https://docs.example.com/lesson1',
    required: false,
  })
  resources?: string;

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

class Attendance {
  @ApiProperty()
  id: string;
  @ApiProperty()
  classSessionId: string;
  @ApiProperty()
  studentId: string;
  @ApiProperty()
  present: boolean;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}

export class ClassSessionWithDetailsResponseDto extends ClassSessionResponseDto {
  @ApiProperty({
    description: 'Class information',
    type: Class,
  })
  class: Class;

  @ApiProperty({
    description: 'Attendance records for this session',
    type: Attendance,
    isArray: true,
  })
  Attendance: Attendance;
}
