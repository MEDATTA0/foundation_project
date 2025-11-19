import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({
    description: 'Email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password',
    example: 'password123',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Remember session',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  rememberMe: boolean;
}
