import { ApiProperty } from '@nestjs/swagger';

export class ClassResponseDto {
  @ApiProperty({
    description: 'Class ID',
    example: 'class-uuid-123',
  })
  id: string;

  @ApiProperty({
    description: 'Class name',
    example: 'Mathematics 101',
  })
  name: string;

  @ApiProperty({
    description: 'Class start date',
    example: '2024-01-15T00:00:00.000Z',
  })
  startDate: Date;

  @ApiProperty({
    description: 'Class end date',
    example: '2024-06-15T00:00:00.000Z',
    required: false,
  })
  endDate?: Date;

  @ApiProperty({
    description: 'Teacher ID',
    example: 'teacher-uuid-456',
  })
  teacherId: string;

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
