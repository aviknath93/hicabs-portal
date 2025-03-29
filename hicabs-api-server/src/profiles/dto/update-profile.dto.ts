import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    example: 'VendorX',
    description: 'Name of the vendor',
  })
  @IsOptional()
  @IsString()
  vendorName?: string;

  @ApiPropertyOptional({
    example: 'We provide top-class travel services',
    description: 'Short bio of the vendor',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    example: '91',
    description: 'Country code without plus sign',
  })
  @IsOptional()
  @IsNumberString()
  contactCountryCode?: string;

  @ApiPropertyOptional({
    example: '9876543210',
    description: 'Contact number without country code',
  })
  @IsOptional()
  @IsNumberString()
  contact?: string;
}
