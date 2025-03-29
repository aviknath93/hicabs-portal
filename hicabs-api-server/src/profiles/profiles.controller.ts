import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from '../auth/types/request-with-user';
import { handleException } from '../utils/exception-handler.util';

@ApiTags('profiles')
@ApiBearerAuth('access-token') // Enables Authorization in Swagger
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @UseGuards(AuthGuard('jwt')) // Ensures only authenticated users can access
  @Get('me')
  @ApiOperation({ summary: 'Get my profile' })
  @ApiResponse({ status: 200, description: 'Profile fetched successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyProfile(@Req() req: RequestWithUser) {
    try {
      if (!req.user) {
        throw new Error('User is not attached to the request');
      }
      const userId = req.user.userId;
      return await this.profilesService.getProfileByUserId(userId);
    } catch (error) {
      handleException(error);
    }
  }
}
