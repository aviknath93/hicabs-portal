import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { PasswordsService } from '../passwords/passwords.service';
import { ProfilesService } from '../profiles/profiles.service';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { SessionsService } from 'src/sessions/sessions.service';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    private passwordsService: PasswordsService,
    private profilesService: ProfilesService,
    private sessionsService: SessionsService,
    private configService: ConfigService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<{ userId: string }> {
    const { email, password, confirmPassword, name, userType } = createUserDto;

    if (password !== confirmPassword) {
      throw new HttpException(
        {
          message: 'Validation failed',
          errors: [
            {
              field: 'confirmPassword',
              constraints: {
                match: 'Passwords do not match',
              },
            },
          ],
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new HttpException(
        {
          message: 'Validation failed',
          errors: [
            {
              field: 'email',
              constraints: {
                unique: 'User already exists',
              },
            },
          ],
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const emailVerificationOtp = Math.floor(100000 + Math.random() * 900000);

    const user = this.userRepository.create({
      email,
      name,
      userType,
      emailVerificationOtp,
    });

    const savedUser = await this.userRepository.save(user);

    const hashedPassword: string = await bcrypt.hash(password, 10);

    await this.passwordsService.create(savedUser, hashedPassword);

    await this.profilesService.create(savedUser);

    await this.sendVerificationEmail(savedUser.email, emailVerificationOtp);

    return { userId: savedUser.userId };
  }

  async sendVerificationEmail(email: string, otp: number) {
    const emailService =
      this.configService.get<string>('EMAIL_SERVICE') || 'gmail';
    const emailUser = this.configService.get<string>('EMAIL_AUTH_USER');
    const emailPass = this.configService.get<string>('EMAIL_AUTH_PASS');

    if (!emailUser || !emailPass) {
      throw new HttpException(
        {
          message: 'Configuration error',
          errors: [
            {
              field: 'NA',
              constraints: {
                missing: 'Email configuration is missing',
              },
            },
          ],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const transporter = nodemailer.createTransport({
      service: emailService,
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const subject = 'HiCabs - Email Verification';
    const html = `<p>Your verification code is <strong>${otp}</strong></p>`;

    const mailOptions = {
      from: emailUser,
      to: email,
      subject: subject,
      html: html,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw new HttpException(
        {
          message: 'Email sending failed',
          errors: [
            {
              field: 'NA',
              constraints: {
                send: 'Failed to send email',
              },
            },
          ],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyEmail(userId: string, otp: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { userId } });

    if (!user) {
      throw new HttpException(
        {
          message: 'User not found',
          errors: [
            {
              field: 'NA',
              constraints: {
                notFound: 'User not found',
              },
            },
          ],
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (user.emailVerificationOtp !== otp) {
      throw new HttpException(
        {
          message: 'Invalid OTP',
          errors: [
            {
              field: 'otp',
              constraints: {
                invalid: 'Invalid OTP',
              },
            },
          ],
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    user.isEmailVerified = true;
    await this.userRepository.save(user);
  }

  async resendVerificationEmail(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { userId } });

    if (!user) {
      throw new HttpException(
        {
          message: 'User not found',
          errors: [
            {
              field: 'userId',
              constraints: {
                notFound: 'User not found',
              },
            },
          ],
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000);
    user.emailVerificationOtp = newOtp;
    await this.userRepository.save(user);

    await this.sendVerificationEmail(user.email, newOtp);
  }

  async forgotPassword(email: string): Promise<void> {
    if (!email) {
      throw new HttpException(
        {
          message: 'Validation failed',
          errors: [
            {
              field: 'email',
              constraints: {
                notFound: 'Invalid email',
              },
            },
          ],
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException(
        {
          message: 'User not found',
          errors: [
            {
              field: 'email',
              constraints: {
                notFound: 'User not found',
              },
            },
          ],
        },
        HttpStatus.NOT_FOUND,
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

    const resetToken: string = jwt.sign({ userId: user.userId }, jwtSecret, {
      expiresIn: '1h',
    });

    await this.sendResetPasswordEmail(user.email, resetToken);
  }

  async sendResetPasswordEmail(email: string, token: string) {
    const emailUser = this.configService.get<string>('EMAIL_AUTH_USER');
    const emailPass = this.configService.get<string>('EMAIL_AUTH_PASS');

    if (!emailUser || !emailPass) {
      throw new HttpException(
        {
          message: 'Configuration error',
          errors: [
            {
              field: 'NA',
              constraints: {
                missing: 'Email configuration is missing',
              },
            },
          ],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const subject = 'HiCabs - Password Reset';
    const html = `<p>Click <a href="http://yourapp.com/reset-password?token=${token}">here</a> to reset your password.</p>`;

    const mailOptions = {
      from: emailUser,
      to: email,
      subject: subject,
      html: html,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw new HttpException(
        {
          message: 'Email sending failed',
          errors: [
            {
              field: 'NA',
              constraints: {
                send: 'Failed to send email',
              },
            },
          ],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
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

      let decoded;
      try {
        decoded = jwt.verify(token, jwtSecret);
      } catch (err) {
        throw new HttpException(
          {
            message: 'Token verification failed',
            errors: [
              {
                field: 'token',
                constraints: {
                  invalid: 'Invalid or expired token',
                },
              },
            ],
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!(decoded as JwtPayload).userId) {
        throw new HttpException(
          {
            message: 'Invalid token',
            errors: [
              {
                field: 'token',
                constraints: {
                  invalid: 'Token is not a valid JWT payload',
                },
              },
            ],
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const userId = (decoded as JwtPayload).userId;
      const user = await this.userRepository.findOne({ where: { userId } });

      if (!user) {
        throw new HttpException(
          {
            message: 'User not found',
            errors: [
              {
                field: 'userId',
                constraints: {
                  notFound: 'User not found',
                },
              },
            ],
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await this.passwordsService.update(user, hashedPassword);
    } catch (error) {
      throw new HttpException(
        {
          message: 'Token verification failed',
          errors: [
            {
              field: 'token',
              constraints: {
                invalid: 'Invalid or expired token',
              },
            },
          ],
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['password'],
    });
  }

  async findUserById(userId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { userId },
    });
  }

  async createOrUpdateUserSession(
    userId: string,
    ipAddress: string,
    userAgent: string,
    token: string,
  ): Promise<void> {
    await this.sessionsService.createOrUpdateSession(
      userId,
      ipAddress,
      userAgent,
      token,
    );
  }
}
