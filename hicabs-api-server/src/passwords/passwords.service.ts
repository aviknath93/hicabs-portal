import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Password } from './password.entity';
import { User } from '../users/user.entity';

@Injectable()
export class PasswordsService {
  constructor(
    @Inject('PASSWORD_REPOSITORY')
    private passwordRepository: Repository<Password>,
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
      where: { user: { userId: user.userId } }, // Adjust to the correct field
      relations: ['user'], // Ensure the user relation is loaded
    });

    if (!password) {
      throw new HttpException(
        {
          message: 'Password update failed',
          errors: [
            {
              field: 'userId',
              constraints: {
                notFound: 'Password record not found for the user',
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
}
