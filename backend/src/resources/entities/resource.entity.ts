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
    description: 'Resource content',
    example: 'https://example.com/textbook.pdf',
  })
  resource: string;

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
