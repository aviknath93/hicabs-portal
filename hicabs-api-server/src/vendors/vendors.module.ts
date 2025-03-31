import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { VendorsService } from './vendors.service';
import { vendorProviders } from './vendors.providers';
import { VendorsController } from './vendors.controller';
import { UserTypeGuard } from 'src/auth/guards/user-type.guard';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [DatabaseModule, UsersModule],
  providers: [VendorsService, UserTypeGuard, ...vendorProviders],
  controllers: [VendorsController],
  exports: [VendorsService],
})
export class VendorsModule {}
