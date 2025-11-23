import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsUrl,
} from 'class-validator';

export class CreateResourceDto {
  @ApiProperty({
    description: 'Resource title',
    example: 'Basic Counting Course',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Resource description',
    example: 'Learn numbers 1-10 with fun activities',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Resource URL (document link or video URL)',
    example: 'https://example.com/textbook.pdf',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl({}, { message: 'Resource must be a valid URL' })
  resource: string;

  @ApiProperty({
    description: 'Minimum age for this resource',
    example: 4,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  ageMin?: number;

  @ApiProperty({
    description: 'Maximum age for this resource',
    example: 6,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  ageMax?: number;
}
