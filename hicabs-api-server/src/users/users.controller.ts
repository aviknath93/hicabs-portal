import {
  Controller,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { handleException } from '../utils/exception-handler.util';
import { UserType } from './user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register user' })
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      if (
        ![UserType.VENDOR, UserType.DRIVER].includes(createUserDto.userType)
      ) {
        throw new HttpException(
          'Only VENDOR and DRIVER can register using this endpoint',
          HttpStatus.BAD_REQUEST,
        );
      }
      return await this.usersService.register(createUserDto);
    } catch (error) {
      handleException(error);
    }
  }

  @Post('register-admin')
  @ApiOperation({ summary: 'Register admin' })
  async registerAdmin(@Body() createUserDto: CreateUserDto) {
    try {
      if (createUserDto.userType !== UserType.ADMIN) {
        throw new HttpException(
          'Only ADMIN can register using this endpoint',
          HttpStatus.BAD_REQUEST,
        );
      }
      return await this.usersService.register(createUserDto);
    } catch (error) {
      handleException(error);
    }
  }

  @Post('verify-email/:userId')
  @ApiOperation({ summary: 'Verify user email' })
  @ApiParam({ name: 'userId', description: 'The ID of the user', type: String })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        otp: {
          type: 'number',
          example: 123456,
          description: 'The OTP for email verification',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Email verified successfully' })
  async verifyEmail(@Param('userId') userId: string, @Body('otp') otp: number) {
    try {
      await this.usersService.verifyEmail(userId, otp);
      return { message: 'Email verified successfully' };
    } catch (error) {
      handleException(error);
    }
  }

  @Post('resend-verification/:userId')
  @ApiOperation({ summary: 'Resend verification email' })
  @ApiParam({ name: 'userId', description: 'The ID of the user', type: String })
  @ApiResponse({
    status: 201,
    description: 'Verification email sent successfully',
  })
  async resendVerificationEmail(@Param('userId') userId: string) {
    try {
      await this.usersService.resendVerificationEmail(userId);
      return { message: 'Verification email sent successfully' };
    } catch (error) {
      handleException(error);
    }
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'user@example.com',
          description: 'The email of the user requesting password reset',
        },
      },
    },
  })
  async forgotPassword(@Body('email') email: string) {
    try {
      await this.usersService.forgotPassword(email);
      return { message: 'Password reset email sent successfully' };
    } catch (error) {
      handleException(error);
    }
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
          example: 'reset-token',
          description: 'The password reset token',
        },
        newPassword: {
          type: 'string',
          example: 'newPassword123',
          description: 'The new password',
        },
      },
    },
  })
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    try {
      await this.usersService.resetPassword(token, newPassword);
      return { message: 'Password reset successfully' };
    } catch (error) {
      handleException(error);
    }
  }
}
