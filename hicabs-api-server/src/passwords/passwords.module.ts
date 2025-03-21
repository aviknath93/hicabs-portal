import { Module } from '@nestjs/common';
import { PasswordsService } from './passwords.service';
import { passwordProviders } from './passwords.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [PasswordsService, ...passwordProviders],
  exports: [PasswordsService],
})
export class PasswordsModule {}
