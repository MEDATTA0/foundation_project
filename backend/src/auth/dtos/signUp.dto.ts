import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  // IsStrongPassword,
  IsUrl,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  name: string;

  @IsString()
  // @IsStrongPassword({ minLength: 8 })
  password: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsUrl()
  image: string;

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}
