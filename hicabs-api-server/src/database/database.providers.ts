import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

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
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
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
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      });

      return dataSource.initialize();
    },
    inject: [ConfigService],
  },
];
