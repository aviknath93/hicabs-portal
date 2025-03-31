import { DataSource } from 'typeorm';
import { Driver } from './driver.entity';

export const driverProviders = [
  {
    provide: 'DRIVER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Driver),
    inject: ['DATA_SOURCE'],
  },
];
