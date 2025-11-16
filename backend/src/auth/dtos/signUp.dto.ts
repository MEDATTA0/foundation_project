import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  // IsStrongPassword,
  IsUrl,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'User password (minimum 8 characters)',
    example: 'password123',
  })
  @IsString()
  // @IsStrongPassword({ minLength: 8 })
  password: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Profile image URL',
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  image: string;

  @ApiProperty({
    description: 'Whether to remember the user session',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}
