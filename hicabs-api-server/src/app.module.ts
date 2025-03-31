import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProfilesModule } from './profiles/profiles.module';
import { PasswordsModule } from './passwords/passwords.module';
import { DriversModule } from './drivers/drivers.module';
import { VendorsModule } from './vendors/vendors.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available globally
    }),
    UsersModule,
    AuthModule,
    ProfilesModule,
    PasswordsModule,
    DriversModule,
    VendorsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
