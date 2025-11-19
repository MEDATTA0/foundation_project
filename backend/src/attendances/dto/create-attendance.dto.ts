import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateAttendanceDto {
  @IsString()
  @IsNotEmpty()
  classSessionId: string;

  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsBoolean()
  present: boolean;
}
