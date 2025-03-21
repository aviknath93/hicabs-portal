import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { PasswordsService } from '../passwords/passwords.service';
import { ProfilesService } from '../profiles/profiles.service';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { SessionsService } from 'src/sessions/sessions.service';
import * as jwt from 'jsonwebtoken';

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
    const { email, password, confirmPassword, vendorName, userType } =
      createUserDto;

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
      vendorName,
      userType,
      emailVerificationOtp,
    });

    const savedUser = await this.userRepository.save(user);

    const hashedPassword: string = await bcrypt.hash(password, 10);

    await this.passwordsService.create(savedUser, hashedPassword);

    await this.profilesService.create(savedUser);

    await this.sendVerificationEmail(savedUser.email, emailVerificationOtp);

    // Return only the userId
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
      secure: false, // Use `true` for port 465, `false` for other ports
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
          message: 'NA',
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

  async login(loginUserDto: LoginUserDto): Promise<string> {
    const { email, password, userAgent, ipAddress } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['password'],
    });

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
      await this.sendVerificationEmail(user.email, user.emailVerificationOtp);

      throw new HttpException(
        {
          message: 'Validation failed',
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

    await this.sessionsService.createOrUpdateSession(
      user.userId,
      ipAddress,
      userAgent,
      token,
    );

    return token;
  }
}
