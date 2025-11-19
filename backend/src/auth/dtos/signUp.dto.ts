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
    description: 'Full name',
    example: 'John Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Password (min 8 characters)',
    example: 'password123',
  })
  @IsString()
  // @IsStrongPassword({ minLength: 8 })
  password: string;

  @ApiProperty({
    description: 'Email address',
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
    description: 'Remember session',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}
