// dto/driver.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class DriverDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the driver',
  })
  driver_id: number;

  @ApiProperty({
    example: 'John Doe',
    description: 'The full name of the driver',
  })
  name: string;

  @ApiProperty({
    example: '123-456-7890',
    description: 'The mobile number of the driver',
  })
  mobile: string;

  @ApiProperty({
    example: '123 Main St, Anytown, USA',
    description: 'The address of the driver',
  })
  address: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'The email address of the driver',
  })
  email: string;
}
