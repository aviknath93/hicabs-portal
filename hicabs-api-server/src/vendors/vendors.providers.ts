import { DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import { Profile } from '../profiles/profile.entity';

export const vendorProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: ['DATA_SOURCE_HICABS_PORTAL'],
  },
  {
    provide: 'PROFILE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Profile),
    inject: ['DATA_SOURCE_HICABS_PORTAL'],
  },
];
