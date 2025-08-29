import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { SignalService } from './signal.service';
import { ProcessXRayDataDto } from './dto/process-xray-data.dto';
import { SignalResponseDto } from './dto/signal-response.dto';
import { SignalStatsDto } from './dto/signal-stats.dto';
import { ApiResponseDto } from './dto/api-response.dto';
import { UpdateSignalDto } from './dto/update-signal.dto';

@ApiTags('Signals')
@Controller('signals')
export class SignalController {
  private readonly logger = new Logger(SignalController.name);

  constructor(private readonly signalService: SignalService) {}

  @Post('process')
  @ApiOperation({
    summary: 'Process X-ray data',
    description:
      'Process incoming x-ray data from IoT devices and store it in the database',
  })
  @ApiBody({
    type: ProcessXRayDataDto,
    examples: {
      example: {
        value: {
          '66bb584d4ae73e488c30a072': {
            data: [
              [762, [51.339764, 12.339223833333334, 1.2038000000000002]],
              [1766, [51.33977733333333, 12.339211833333334, 1.531604]],
              [2763, [51.339782, 12.339196166666667, 2.13906]],
            ],
            time: 1735683480000,
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'X-ray data processed successfully',
    type: ApiResponseDto<SignalResponseDto>,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid x-ray data format',
    schema: {
      example: {
        success: false,
        message: 'Failed to process x-ray data',
        error: 'Invalid x-ray data format',
      },
    },
  })
  async processXRayData(@Body() rawData: ProcessXRayDataDto) {
    try {
      this.logger.log('Processing x-ray data');
      const processedData = await this.signalService.processXRayData(rawData);
      const savedSignal = await this.signalService.saveSignal(processedData);
      return {
        success: true,
        data: savedSignal,
        message: 'X-ray data processed and saved successfully',
      };
    } catch (error) {
      this.logger.error('Error processing x-ray data', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to process x-ray data',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Get all signals',
    description:
      'Retrieve all x-ray signals with optional filtering by device ID or date range',
  })
  @ApiQuery({
    name: 'deviceId',
    required: false,
    description: 'Filter by device ID',
    example: '66bb584d4ae73e488c30a072',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Filter by start date (ISO format)',
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Filter by end date (ISO format)',
    example: '2024-12-31',
  })
  @ApiResponse({
    status: 200,
    description: 'Signals retrieved successfully',
    type: ApiResponseDto<[SignalResponseDto]>,
  })
  async getAllSignals(
    @Query('deviceId') deviceId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    try {
      let signals;

      if (deviceId) {
        signals = await this.signalService.getSignalsByDeviceId(deviceId);
      } else if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        signals = await this.signalService.getSignalsByDateRange(start, end);
      } else {
        signals = await this.signalService.getAllSignals();
      }

      return {
        success: true,
        data: signals,
        count: signals.length,
      };
    } catch (error) {
      this.logger.error('Error fetching signals', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch signals',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Get signal statistics',
    description: 'Retrieve aggregated statistics about all x-ray signals',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    type: ApiResponseDto<SignalStatsDto>,
  })
  async getSignalStats() {
    try {
      const stats = await this.signalService.getSignalStatistics();
      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      this.logger.error('Error fetching signal statistics', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch signal statistics',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get signal by ID',
    description: 'Retrieve a specific x-ray signal by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Signal ID',
    example: '68b050a2a382a0eecbe9f400',
  })
  @ApiResponse({
    status: 200,
    description: 'Signal retrieved successfully',
    type: ApiResponseDto<SignalResponseDto>,
  })
  @ApiResponse({
    status: 404,
    description: 'Signal not found',
    schema: {
      example: {
        success: false,
        message: 'Signal not found',
      },
    },
  })
  async getSignalById(@Param('id') id: string) {
    try {
      const signal = await this.signalService.getSignalById(id);
      if (!signal) {
        throw new HttpException(
          {
            success: false,
            message: 'Signal not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        data: signal,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Error fetching signal by ID', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch signal',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update signal',
    description: 'Update a specific x-ray signal',
  })
  @ApiParam({
    name: 'id',
    description: 'Signal ID',
    example: '68b050a2a382a0eecbe9f400',
  })
  @ApiBody({ type: UpdateSignalDto })
  @ApiResponse({
    status: 200,
    description: 'Signal updated successfully',
    type: ApiResponseDto<SignalResponseDto>,
  })
  @ApiResponse({
    status: 404,
    description: 'Signal not found',
    schema: {
      example: {
        success: false,
        message: 'Signal not found',
      },
    },
  })
  async updateSignal(
    @Param('id') id: string,
    @Body() updateData: UpdateSignalDto,
  ) {
    try {
      const updatedSignal = await this.signalService.updateSignal(
        id,
        updateData,
      );
      if (!updatedSignal) {
        throw new HttpException(
          {
            success: false,
            message: 'Signal not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        data: updatedSignal,
        message: 'Signal updated successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Error updating signal', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to update signal',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete signal',
    description: 'Delete a specific x-ray signal',
  })
  @ApiParam({
    name: 'id',
    description: 'Signal ID',
    example: '68b050a2a382a0eecbe9f400',
  })
  @ApiResponse({
    status: 200,
    description: 'Signal deleted successfully',
    type: ApiResponseDto<SignalResponseDto>,
  })
  @ApiResponse({
    status: 404,
    description: 'Signal not found',
    schema: {
      example: {
        success: false,
        message: 'Signal not found',
      },
    },
  })
  async deleteSignal(@Param('id') id: string) {
    try {
      const deletedSignal = await this.signalService.deleteSignal(id);
      if (!deletedSignal) {
        throw new HttpException(
          {
            success: false,
            message: 'Signal not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        data: deletedSignal,
        message: 'Signal deleted successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Error deleting signal', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to delete signal',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
