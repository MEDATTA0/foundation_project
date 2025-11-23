import { ApiProperty } from '@nestjs/swagger';

export class Resource {
  @ApiProperty({
    description: 'Resource ID',
    example: 'clxxxxxxxxxxxxx',
  })
  id: string;

  @ApiProperty({
    description: 'Class ID',
    example: 'clxxxxxxxxxxxxx',
  })
  classId: string;

  @ApiProperty({
    description: 'Resource title',
    example: 'Basic Counting Course',
    required: false,
  })
  title?: string;

  @ApiProperty({
    description: 'Resource description',
    example: 'Learn numbers 1-10 with fun activities',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Resource URL',
    example: 'https://example.com/textbook.pdf',
  })
  resource: string;

  @ApiProperty({
    description: 'Minimum age',
    example: 4,
    required: false,
  })
  ageMin?: number;

  @ApiProperty({
    description: 'Maximum age',
    example: 6,
    required: false,
  })
  ageMax?: number;

  @ApiProperty({
    description: 'Creation date',
    example: '2025-11-23T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2025-11-23T10:00:00.000Z',
  })
  updatedAt: Date;
}
