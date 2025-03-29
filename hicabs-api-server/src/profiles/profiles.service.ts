import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import { User } from '../users/user.entity';
import { ProfileResponseDto } from './dto/profile-response.dto';

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

  async getProfileByUserId(userId: string): Promise<ProfileResponseDto> {
    const profile = await this.profileRepository.findOne({
      where: { user: { userId } },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return {
      profileId: profile.profileId,
      user: {
        vendorName: profile.user.vendorName,
        email: profile.user.email,
      },
      bio: profile.bio,
      profileImageUrl: profile.profileImageUrl,
      contactCountryCode: profile.contactCountryCode,
      contact: profile.contact,
      contactVerified: profile.contactVerified,
    };
  }
}
