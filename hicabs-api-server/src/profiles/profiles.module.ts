import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { profileProviders } from './profiles.providers';
import { ProfilesService } from './profiles.service';

@Module({
  imports: [DatabaseModule],
  providers: [ProfilesService, ...profileProviders],
  exports: [ProfilesService],
})
export class ProfilesModule {}
