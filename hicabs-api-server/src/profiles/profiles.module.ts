import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { profileProviders } from './profiles.providers';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';

@Module({
  imports: [DatabaseModule],
  providers: [ProfilesService, ...profileProviders],
  controllers: [ProfilesController],
  exports: [ProfilesService],
})
export class ProfilesModule {}
