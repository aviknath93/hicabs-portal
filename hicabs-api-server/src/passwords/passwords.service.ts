import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Password } from './password.entity';
import { User } from '../users/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordsService {
  constructor(
    @Inject('PASSWORD_REPOSITORY')
    private passwordRepository: Repository<Password>,

    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async create(user: User, hashedPassword: string): Promise<Password> {
    const password = this.passwordRepository.create({
      user,
      hashedPassword,
    });
    return this.passwordRepository.save(password);
  }

  async update(user: User, newHashedPassword: string): Promise<Password> {
    const password = await this.passwordRepository.findOne({
      where: { user: { userId: user.userId } },
      relations: ['user'],
    });

    if (!password) {
      throw new HttpException(
        {
          message: 'Password update failed',
          errors: [
            {
              field: 'userId',
              constraints: {
                notFound: 'Password record not found for the user.',
              },
            },
          ],
        },
        HttpStatus.NOT_FOUND,
      );
    }

    password.hashedPassword = newHashedPassword;
    return this.passwordRepository.save(password);
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const { oldPassword, newPassword, confirmNewPassword } = dto;

    if (newPassword !== confirmNewPassword) {
      throw new HttpException(
        {
          message: 'Validation failed',
          errors: [
            {
              field: 'newPassword',
              constraints: {
                mismatch: 'New passwords do not match.',
              },
            },
          ],
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['password'],
    });

    if (!user) {
      throw new HttpException(
        {
          message: 'Validation failed',
          errors: [
            {
              field: 'userId',
              constraints: {
                notFound: 'User not found.',
              },
            },
          ],
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const isMatch = await bcrypt.compare(
      oldPassword,
      user.password.hashedPassword,
    );

    if (!isMatch) {
      throw new HttpException(
        {
          message: 'Validation failed',
          errors: [
            {
              field: 'oldPassword',
              constraints: {
                incorrect: 'Old password is incorrect.',
              },
            },
          ],
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.update(user, hashedPassword);

    return { message: 'Password changed successfully' };
  }
}
