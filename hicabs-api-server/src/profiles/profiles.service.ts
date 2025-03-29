import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import { User } from '../users/user.entity';
import { ProfileResponseDto } from './dto/profile-response.dto';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @Inject('PROFILE_REPOSITORY')
    private profileRepository: Repository<Profile>,
  ) {}

  async create(user: User): Promise<Profile> {
    const profile = this.profileRepository.create({ user });
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

  async updateProfileImage(
    userId: string,
    file: Express.Multer.File,
  ): Promise<{ message: string; profileImageUrl: string }> {
    const profile = await this.profileRepository.findOne({
      where: { user: { userId } },
      relations: ['user'],
    });

    if (!profile) throw new NotFoundException('Profile not found');

    // Delete old image if exists
    if (profile.profileImageUrl) {
      const oldImagePath = path.join(
        __dirname,
        '../../',
        profile.profileImageUrl,
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Compress using sharp
    const compressedFilename = `${Date.now()}.webp`;
    const compressedPath = path.join(
      'uploads',
      'profileImages',
      compressedFilename,
    );

    await sharp(file.path)
      .resize(500) // Optional resize
      .jpeg({ quality: 80 })
      .toFile(compressedPath);

    // Delete original uncompressed file
    fs.unlinkSync(file.path);

    // Save new image path in DB
    profile.profileImageUrl = compressedPath;
    await this.profileRepository.save(profile);

    return {
      message: 'Profile image updated successfully',
      profileImageUrl: compressedPath,
    };
  }

  async updateProfileDetails(
    userId: string,
    updateDto: UpdateProfileDto,
  ): Promise<{ message: string }> {
    const profile = await this.profileRepository.findOne({
      where: { user: { userId } },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const { vendorName, bio, contactCountryCode, contact } = updateDto;

    if (vendorName) profile.user.vendorName = vendorName;
    if (bio) profile.bio = bio;
    if (contactCountryCode)
      profile.contactCountryCode = Number(contactCountryCode);
    if (contact) profile.contact = Number(contact);

    await this.profileRepository.save(profile);
    await this.profileRepository.manager.save(profile.user);

    return { message: 'Profile updated successfully' };
  }
}
