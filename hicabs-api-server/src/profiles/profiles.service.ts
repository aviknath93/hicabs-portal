import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @Inject('PROFILE_REPOSITORY')
    private profileRepository: Repository<Profile>,
  ) {}

  async create(user: User): Promise<Profile> {
    const profile = this.profileRepository.create({
      user,
    });
    return this.profileRepository.save(profile);
  }
}
