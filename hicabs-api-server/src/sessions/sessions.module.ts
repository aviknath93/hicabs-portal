import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { sessionProviders } from './sessions.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [SessionsService, ...sessionProviders],
  exports: [SessionsService],
})
export class SessionsModule {}
