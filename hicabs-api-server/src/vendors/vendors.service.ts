import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User, UserType } from '../users/user.entity';
import { Profile } from '../profiles/profile.entity';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Injectable()
export class VendorsService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    @Inject('PROFILE_REPOSITORY')
    private profileRepository: Repository<Profile>,
  ) {}

  async getVendors() {
    const vendors = await this.userRepository.find({
      where: { userType: UserType.VENDOR },
      relations: ['profile'],
    });

    // Transform the data to remove unwanted fields
    return vendors.map((vendor) => {
      const { emailVerificationOtp, ...vendorWithoutOtp } = vendor;
      const {
        contactVerificationOtp,
        contactVerificationOtpExpireDatetime,
        ...profileWithoutOtp
      } = vendor.profile;

      return {
        ...vendorWithoutOtp,
        profile: profileWithoutOtp,
      };
    });
  }

  async updateVendor(
    vendorId: string,
    updateVendorDto: UpdateVendorDto,
  ): Promise<void> {
    const { isBlocked } = updateVendorDto;

    const vendor = await this.userRepository.findOne({
      where: { userId: vendorId, userType: UserType.VENDOR },
    });

    if (!vendor) {
      throw new HttpException(
        {
          message: 'Vendor not found',
          errors: [
            {
              field: 'vendorId',
              constraints: {
                notFound:
                  'Vendor not found or you do not have permission to update this vendor',
              },
            },
          ],
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (isBlocked !== undefined) {
      vendor.isBlocked = isBlocked;
    }

    await this.userRepository.save(vendor);
  }
}
