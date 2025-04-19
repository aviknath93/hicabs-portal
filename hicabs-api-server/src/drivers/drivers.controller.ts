// drivers.controller.ts
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DriversService } from './drivers.service';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from '../auth/types/request-with-user';
import { DriverDto } from './dto/driver.dto';

@ApiTags('drivers')
@ApiBearerAuth('access-token')
@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Get('list')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get list of drivers by vendorId' })
  @ApiResponse({
    status: 200,
    description: 'List of drivers retrieved successfully',
    type: [DriverDto],
  })
  async getDrivers(@Req() req: RequestWithUser): Promise<DriverDto[]> {
    const vendorId = req.user.userId;
    return this.driversService.getDriversByVendorId(vendorId);
  }
}
