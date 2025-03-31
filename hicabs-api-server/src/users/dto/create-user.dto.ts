import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '../user.entity';

export class CreateUserDto {
  @ApiProperty({
    example: 'Acme Corp',
    description: 'The name of the vendor',
  })
  @IsNotEmpty({ message: 'Vendor name is required' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'vendor@example.com',
    description: 'The email address of the vendor',
  })
  @IsEmail({}, { message: 'A valid email address is required' })
  email: string;

  @ApiProperty({
    example: 'Password123',
    description:
      'The password for the vendor account. Must be at least 8 characters long and contain at least one letter and one number.',
  })
  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message:
      'Password must be at least 8 characters long and contain at least one letter and one number',
  })
  password: string;

  @ApiProperty({
    example: 'Password123',
    description: 'Confirmation of the password. Must match the password field.',
  })
  @IsString()
  confirmPassword: string;

  @ApiProperty({
    example: UserType.VENDOR, // Replace with an actual example value from your UserType enum
    description: 'The type of user. Must be one of the defined user types.',
    enum: UserType,
  })
  @IsEnum(UserType)
  userType: UserType;
}
