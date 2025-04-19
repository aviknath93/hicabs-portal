import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/user.entity';
import { Profile } from 'src/profiles/profile.entity';
import { Session } from 'src/sessions/session.entity';
import { Password } from 'src/passwords/password.entity';
import { Employee } from 'src/drivers/driver.entity';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE_HICABS_PORTAL',
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: configService.get('HICABS_PORTAL_DB_HOST'),
        port: configService.get<number>('HICABS_PORTAL_DB_PORT'),
        username: configService.get('HICABS_PORTAL_DB_USER'),
        password: configService.get('HICABS_PORTAL_DB_PASSWORD'),
        database: configService.get('HICABS_PORTAL_DB_NAME'),
        entities: [User, Profile, Session, Password],
        synchronize: true, // Set to false in production
      });

      return dataSource.initialize();
    },
    inject: [ConfigService],
  },
  {
    provide: 'DATA_SOURCE_HICABS',
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: configService.get('HICABS_DB_HOST'),
        port: configService.get<number>('HICABS_DB_PORT'),
        username: configService.get('HICABS_DB_USER'),
        password: configService.get('HICABS_DB_PASSWORD'),
        database: configService.get('HICABS_DB_NAME'),
        entities: [Employee],
        synchronize: true, // Set to false in production
      });

      return dataSource.initialize();
    },
    inject: [ConfigService],
  },
];
