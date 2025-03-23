import { IsEmail, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    example: 'vendor@example.com',
    description: 'The email address of the vendor',
  })
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @ApiProperty({
    example: 'Password123',
    description: 'The password for the vendor account.',
  })
  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: 'Invalid password',
  })
  password: string;

  @ApiProperty({
    example:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    description: 'The user agent string of the client making the request.',
  })
  @IsString({ message: 'Invalid user agent' })
  userAgent: string;

  @ApiProperty({
    example: '192.168.1.1',
    description: 'The IP address of the client making the request.',
  })
  @IsString({ message: 'Invalid IP address' })
  ipAddress: string;
}
