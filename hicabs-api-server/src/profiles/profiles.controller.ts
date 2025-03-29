import {
  Controller,
  Get,
  Req,
  UseGuards,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UseFilters,
  Put,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from '../auth/types/request-with-user';
import { handleException } from '../utils/exception-handler.util';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { MulterExceptionFilter } from 'src/filters/multer-exception.filter';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('profiles')
@ApiBearerAuth('access-token')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @ApiOperation({ summary: 'Get my profile' })
  @ApiResponse({ status: 200, description: 'Profile fetched successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyProfile(@Req() req: RequestWithUser) {
    try {
      const userId = req.user.userId;
      return await this.profilesService.getProfileByUserId(userId);
    } catch (error) {
      handleException(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @UseFilters(MulterExceptionFilter)
  @Put('upload-image')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 3 * 1024 * 1024 }, // 3MB
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
          'image/jpg',
          'image/jpeg',
          'image/png',
          'image/webp',
          'image/heic',
          'image/heif',
        ];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          const err = new MulterError('LIMIT_UNEXPECTED_FILE');
          err.message =
            'Only JPG, JPEG, PNG, WebP, or HEIC image files are allowed!';
          return cb(err, false);
        }
        cb(null, true);
      },
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = path.join('uploads', 'profileImages');
          fs.mkdirSync(uploadPath, { recursive: true });
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          const filename = `profile-${Date.now()}${ext}`;
          cb(null, filename);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload profile image' })
  @ApiResponse({ status: 200, description: 'Profile image updated' })
  @ApiResponse({ status: 400, description: 'No file uploaded' })
  async uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: RequestWithUser,
  ) {
    try {
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      const userId = req.user.userId;
      return await this.profilesService.updateProfileImage(userId, file);
    } catch (error) {
      handleException(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('update-details')
  @ApiOperation({ summary: 'Update profile details' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiOkResponse({
    description: 'Profile updated successfully',
    schema: {
      example: {
        message: 'Profile updated successfully',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateProfileDetails(
    @Req() req: RequestWithUser,
    @Body() updateDto: UpdateProfileDto,
  ) {
    try {
      const userId = req.user.userId;
      return await this.profilesService.updateProfileDetails(userId, updateDto);
    } catch (error) {
      handleException(error);
    }
  }
}
