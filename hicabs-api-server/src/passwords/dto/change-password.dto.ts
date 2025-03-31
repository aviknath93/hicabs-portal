import { IsString, MinLength, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  oldPassword: string;

  @IsString()
  @MinLength(6, { message: 'New password must be at least 6 characters long' })
  @Matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*/, {
    message: 'New password must contain upper, lower case letters and a number',
  })
  newPassword: string;

  @IsString()
  confirmNewPassword: string;
}
