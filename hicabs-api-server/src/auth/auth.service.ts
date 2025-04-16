import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async login(loginUserDto: LoginUserDto): Promise<string> {
    const { email, password, userAgent, ipAddress } = loginUserDto;

    const user = await this.usersService.findUserByEmail(email);

    if (!user) {
      throw new HttpException(
        {
          message: 'Validation failed',
          errors: [
            {
              field: 'email',
              constraints: {
                notFound: 'Account not found. Please register.',
              },
            },
          ],
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!user.isEmailVerified) {
      await this.usersService.sendVerificationEmail(
        user.email,
        user.emailVerificationOtp,
      );

      throw new HttpException(
        {
          message: 'Validation failed',
          userId: user.userId,
          errors: [
            {
              field: 'email',
              constraints: {
                notVerified:
                  'Email is not verified. Please check your email for verification.',
              },
            },
          ],
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password.hashedPassword,
    );
    if (!passwordMatch) {
      throw new HttpException(
        {
          message: 'Validation failed',
          userId: user.userId,
          errors: [
            {
              field: 'NA',
              constraints: {
                mismatch: 'Unable to login. Please check email and password.',
              },
            },
          ],
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user.isBlocked) {
      throw new HttpException(
        {
          message: 'Validation failed',
          errors: [
            {
              field: 'account',
              constraints: {
                inactive: 'Account inactive. Please contact admin.',
              },
            },
          ],
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new HttpException(
        {
          message: 'Validation failed',
          errors: [
            {
              field: 'configuration',
              constraints: {
                missingSecret:
                  'JWT_SECRET is not defined in the environment variables.',
              },
            },
          ],
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const token: string = jwt.sign({ userId: user.userId }, jwtSecret, {
      expiresIn: '2h',
    });

    await this.usersService.createOrUpdateUserSession(
      user.userId,
      ipAddress,
      userAgent,
      token,
    );

    return token;
  }
}
