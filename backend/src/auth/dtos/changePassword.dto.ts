import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class changePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}