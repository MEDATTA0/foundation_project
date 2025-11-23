import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: 'User ID',
    example: 'user-uuid-123',
  })
  id: string;

  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Email verification status',
    example: true,
  })
  emailVerified: boolean;

  @ApiProperty({
    description: 'Profile image URL',
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  image?: string;

  @ApiProperty({
    description: 'Account creation timestamp',
    example: '2024-01-15T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-15T10:00:00.000Z',
  })
  updatedAt: Date;
}

// export class SessionDto {
//   @ApiProperty({
//     description: 'Session ID',
//     example: 'session-uuid-123',
//   })
//   id: string;

//   @ApiProperty({
//     description: 'Session expiration timestamp',
//     example: '2024-12-31T23:59:59.000Z',
//   })
//   expiresAt: Date;

//   @ApiProperty({
//     description: 'Session token',
//     example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
//   })
//   token: string;

//   @ApiProperty({
//     description: 'User ID',
//     example: 'user-uuid-123',
//   })
//   userId: string;
// }

export class AuthResponseDto {
  @ApiProperty()
  redirect: boolean;
  @ApiProperty()
  token: string;
  @ApiProperty({
    description: 'User information',
    type: UserDto,
  })
  user: UserDto;
}

export class PasswordUpdateResponseDto {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  status: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Password updated successfully',
  })
  message: string;
}
