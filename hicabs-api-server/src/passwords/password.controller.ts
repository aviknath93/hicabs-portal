import {
  Controller,
  Put,
  Body,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { PasswordsService } from './passwords.service';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from '../auth/types/request-with-user';
import { ChangePasswordDto } from './dto/change-password.dto';
import { handleException } from '../utils/exception-handler.util';

@ApiTags('passwords')
@ApiBearerAuth('access-token')
@Controller('passwords')
export class PasswordController {
  constructor(private readonly passwordsService: PasswordsService) {}

  @Put('change-password')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Change user password' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        oldPassword: {
          type: 'string',
          example: 'OldPassword123!',
          description: 'The current password of the user',
        },
        newPassword: {
          type: 'string',
          example: 'NewPassword456!',
          description: 'The new password for the user',
        },
        confirmNewPassword: {
          type: 'string',
          example: 'NewPassword456!',
          description: 'Confirmation of the new password',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed or old password incorrect',
  })
  async changePassword(
    @Req() req: RequestWithUser,
    @Body() dto: ChangePasswordDto,
  ) {
    try {
      const userId = req.user.userId;
      return await this.passwordsService.changePassword(userId, dto);
    } catch (error) {
      handleException(error);
    }
  }
}
