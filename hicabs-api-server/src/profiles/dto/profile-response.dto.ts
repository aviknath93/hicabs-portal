// src/profiles/dto/profile-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ProfileUserDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  userType: string;
}

export class ProfileResponseDto {
  @ApiProperty()
  profileId: number;

  @ApiProperty({ type: ProfileUserDto })
  user: ProfileUserDto;

  @ApiProperty({ required: false })
  bio: string | null;

  @ApiProperty({ required: false })
  profileImageUrl: string | null;

  @ApiProperty({ required: false })
  contactCountryCode: number | null;

  @ApiProperty({ required: false })
  contact: number | null;

  @ApiProperty()
  contactVerified: boolean;
}
