import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import { driverProviders } from './drivers.providers';

@Module({
  imports: [DatabaseModule],
  providers: [DriversService, ...driverProviders],
  controllers: [DriversController],
  exports: [DriversService],
})
export class DriversModule {}
