import { Module } from '@nestjs/common';
import { PasswordsService } from './passwords.service';
import { passwordProviders } from './passwords.providers';
import { DatabaseModule } from '../database/database.module';
import { PasswordController } from './password.controller';
import { userProviders } from 'src/users/users.providers';

@Module({
  imports: [DatabaseModule],
  providers: [PasswordsService, ...passwordProviders, ...userProviders],
  controllers: [PasswordController],
  exports: [PasswordsService],
})
export class PasswordsModule {}
