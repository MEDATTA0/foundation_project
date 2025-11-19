import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class changePasswordDto {
  @ApiProperty({
    description: 'Current password',
    example: 'oldPassword123',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  currentPassword: string;

  @ApiProperty({
    description: 'New password',
    example: 'newPassword456',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}
