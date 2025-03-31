import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';
import { CarType } from '../driver.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDriverDto {
  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'The name of the driver',
  })
  @IsOptional()
  @IsNotEmpty({ message: 'Driver name is required' })
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: CarType.FIVE_SEATER,
    description: 'The type of car. Must be one of the defined car types.',
    enum: CarType,
  })
  @IsOptional()
  @IsEnum(CarType, { message: 'Car type must be a valid enum value' })
  carType?: CarType;

  @ApiPropertyOptional({
    example: 'ABC-1234',
    description: 'The registration number of the car',
  })
  @IsOptional()
  @IsString()
  carNo?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Indicates if the driver is blocked',
  })
  @IsOptional()
  @IsBoolean()
  isBlocked?: boolean;
}
