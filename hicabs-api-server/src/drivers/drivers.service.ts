import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Driver } from './driver.entity';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

@Injectable()
export class DriversService {
  constructor(
    @Inject('DRIVER_REPOSITORY')
    private driverRepository: Repository<Driver>,
  ) {}

  async register(
    vendorId: string,
    createDriverDto: CreateDriverDto,
  ): Promise<{ driverId: string }> {
    const { name, carType, carNo } = createDriverDto;

    const existingDriver = await this.driverRepository.findOne({
      where: { carNo },
    });
    if (existingDriver) {
      throw new HttpException(
        {
          message: 'Validation failed',
          errors: [
            {
              field: 'carNo',
              constraints: {
                unique: 'Driver with this car number already exists',
              },
            },
          ],
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const driver = this.driverRepository.create({
      vendorId,
      name,
      carType,
      carNo,
    });

    const savedDriver = await this.driverRepository.save(driver);

    return { driverId: savedDriver.driverId };
  }

  async update(
    driverId: string,
    vendorId: string,
    updateDriverDto: UpdateDriverDto,
  ): Promise<void> {
    const { name, carType, carNo, isBlocked } = updateDriverDto;

    const driver = await this.driverRepository.findOne({
      where: { driverId, vendorId },
    });

    if (!driver) {
      throw new HttpException(
        {
          message: 'Driver not found or unauthorized',
          errors: [
            {
              field: 'driverId',
              constraints: {
                notFound:
                  'Driver not found or you do not have permission to update this driver',
              },
            },
          ],
        },
        HttpStatus.NOT_FOUND,
      );
    }

    await this.driverRepository.update(driverId, {
      name,
      carType,
      carNo,
      isBlocked,
    });
  }
}
