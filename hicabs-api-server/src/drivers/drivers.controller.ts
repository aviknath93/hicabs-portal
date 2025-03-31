import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
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
  ApiParam,
} from '@nestjs/swagger';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from '../auth/types/request-with-user';
import { handleException } from '../utils/exception-handler.util';

@ApiTags('drivers')
@ApiBearerAuth('access-token')
@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post('register')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Register a new driver' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'John Doe',
          description: 'The name of the driver',
        },
        carType: {
          type: 'string',
          example: 'Sedan',
          description: 'The type of car the driver uses',
        },
        carNo: {
          type: 'string',
          example: 'ABC-1234',
          description: 'The car number of the driver',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Driver registered successfully' })
  async register(
    @Req() req: RequestWithUser,
    @Body() createDriverDto: CreateDriverDto,
  ) {
    try {
      const vendorId = req.user.userId;
      return await this.driversService.register(vendorId, createDriverDto);
    } catch (error) {
      handleException(error);
    }
  }

  @Patch('update/:driverId')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Update driver details' })
  @ApiParam({
    name: 'driverId',
    description: 'The ID of the driver',
    type: String,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'John Doe',
          description: 'The updated name of the driver',
        },
        carType: {
          type: 'string',
          example: 'SUV',
          description: 'The updated type of car the driver uses',
        },
        carNo: {
          type: 'string',
          example: 'XYZ-5678',
          description: 'The updated car number of the driver',
        },
        isBlocked: {
          type: 'boolean',
          example: 'false',
          description: 'Block or unblock driver',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Driver updated successfully' })
  async update(
    @Req() req: RequestWithUser,
    @Param('driverId') driverId: string,
    @Body() updateDriverDto: UpdateDriverDto,
  ) {
    try {
      const vendorId = req.user.userId;
      return await this.driversService.update(
        driverId,
        vendorId,
        updateDriverDto,
      );
    } catch (error) {
      handleException(error);
    }
  }
}
