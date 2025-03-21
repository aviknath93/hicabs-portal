import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Session } from './session.entity';

@Injectable()
export class SessionsService {
  constructor(
    @Inject('SESSION_REPOSITORY')
    private sessionRepository: Repository<Session>,
  ) {}

  async createOrUpdateSession(
    userId: string,
    ipAddress: string,
    userAgent: string,
    token: string,
  ): Promise<void> {
    // Find the existing session for the user
    let session = await this.sessionRepository.findOne({ where: { userId } });

    if (session) {
      // Update the existing session
      session.ipAddress = ipAddress;
      session.userAgent = userAgent;
      session.token = token;
    } else {
      // Create a new session
      session = this.sessionRepository.create({
        userId,
        ipAddress,
        userAgent,
        token,
      });
    }

    // Save the session (either updated or new)
    await this.sessionRepository.save(session);
  }
}
