// vendors.controller.ts
import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { VendorsService } from './vendors.service';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from '../auth/types/request-with-user';
import { handleException } from '../utils/exception-handler.util';
import { UserType } from 'src/users/user.entity';
import { UserTypeGuard } from 'src/auth/guards/user-type.guard';

@ApiTags('vendors (admin only)')
@ApiBearerAuth('access-token')
@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), UserTypeGuard) // Use the new guard
  @ApiOperation({ summary: 'Get list of vendors' })
  @ApiResponse({
    status: 200,
    description: 'List of vendors retrieved successfully',
  })
  async getVendors(@Req() req: RequestWithUser) {
    try {
      if (req.user.userType !== UserType.ADMIN) {
        throw new Error('Unauthorized');
      }
      return await this.vendorsService.getVendors();
    } catch (error) {
      handleException(error);
    }
  }

  @Patch(':vendorId')
  @UseGuards(AuthGuard('jwt'), UserTypeGuard) // Use the new guard
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Update vendor details' })
  @ApiParam({
    name: 'vendorId',
    description: 'The ID of the vendor',
    type: String,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        isBlocked: {
          type: 'boolean',
          example: false,
          description: 'Block or unblock the vendor',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Vendor updated successfully' })
  async updateVendor(
    @Req() req: RequestWithUser,
    @Param('vendorId') vendorId: string,
    @Body() updateVendorDto: UpdateVendorDto,
  ) {
    try {
      if (req.user.userType !== UserType.ADMIN) {
        throw new Error('Unauthorized');
      }
      return await this.vendorsService.updateVendor(vendorId, updateVendorDto);
    } catch (error) {
      handleException(error);
    }
  }
}
