import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { PasswordsModule } from 'src/passwords/passwords.module';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { UsersService } from './users.service';
import { userProviders } from './users.providers';
import { UsersController } from './users.controller';
import { SessionsModule } from 'src/sessions/sessions.module';

@Module({
  imports: [DatabaseModule, PasswordsModule, ProfilesModule, SessionsModule],
  providers: [UsersService, ...userProviders],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
