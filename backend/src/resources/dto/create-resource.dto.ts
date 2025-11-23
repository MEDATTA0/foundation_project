import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateResourceDto {
  @ApiProperty({
    description: 'Resource content',
    example: ['https://example.com/textbook.pdf'],
    isArray: true,
  })
  @IsArray()
  @IsNotEmpty()
  resources: string[];
}
