import { Injectable, Inject } from '@nestjs/common';
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
}
