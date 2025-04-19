// drivers.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Employee as Driver } from './driver.entity';
import { DriverDto } from './dto/driver.dto';

@Injectable()
export class DriversService {
  constructor(
    @Inject('DRIVER_REPOSITORY')
    private driverRepository: Repository<Driver>,
  ) {}

  async getDriversByVendorId(vendorId: string): Promise<DriverDto[]> {
    // Fetch drivers
    const drivers: Driver[] = await this.driverRepository.find({
      where: { vendor_id: vendorId },
    });

    return drivers.map((driver) => this.toDriverDto(driver));
  }

  private toDriverDto(driver: Driver): DriverDto {
    return {
      driver_id: driver.id,
      name: `${driver.fName} ${driver.lName}`,
      mobile: driver.Mobile,
      address: driver.Address,
      email: driver.email,
    };
  }
}
