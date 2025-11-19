import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAttendanceDto {
  @ApiProperty({
    description: 'Class session ID',
    example: 'session-uuid-123',
  })
  @IsString()
  @IsNotEmpty()
  classSessionId: string;

  @ApiProperty({
    description: 'Student ID',
    example: 'student-uuid-456',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Whether student was present',
    example: true,
  })
  @IsBoolean()
  present: boolean;
}
