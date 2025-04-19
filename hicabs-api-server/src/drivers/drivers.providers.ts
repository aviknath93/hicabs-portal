import { DataSource } from 'typeorm';
import { Employee as Driver } from './driver.entity';

export const driverProviders = [
  {
    provide: 'DRIVER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Driver),
    inject: ['DATA_SOURCE_HICABS'],
  },
];
