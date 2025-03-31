import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { CarType } from '../driver.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDriverDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the driver',
  })
  @IsNotEmpty({ message: 'Driver name is required' })
  @IsString()
  name: string;

  @ApiProperty({
    example: CarType.FIVE_SEATER,
    description: 'The type of car. Must be one of the defined car types.',
    enum: CarType,
  })
  @IsEnum(CarType, { message: 'Car type must be a valid enum value' })
  carType: CarType;

  @ApiProperty({
    example: 'ABC-1234',
    description: 'The registration number of the car',
  })
  @IsNotEmpty({ message: 'Car number is required' })
  @IsString()
  carNo: string;
}
