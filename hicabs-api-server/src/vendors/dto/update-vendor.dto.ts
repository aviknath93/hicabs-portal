import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateVendorDto {
  @IsOptional()
  @IsBoolean()
  isBlocked?: boolean;
}
