import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConsumerService } from './consumer.service';

@ApiTags('Consumer')
@Controller()
export class ConsumerController {
  constructor(private readonly consumerService: ConsumerService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Health check',
    description: 'Check if the consumer service is running'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Service is running',
    schema: {
      example: 'X-Ray IoT Consumer Service'
    }
  })
  getHello(): string {
    return 'X-Ray IoT Consumer Service';
  }

  @Get('stats')
  @ApiOperation({ 
    summary: 'Get processing statistics',
    description: 'Retrieve statistics about message processing and signal storage'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Statistics retrieved successfully',
    schema: {
      example: {
        message: 'Consumer processing statistics',
        stats: {
          totalSignals: 3,
          avgDataLength: 34.33,
          avgDataVolume: 2708.67,
          totalDataVolume: 8126
        },
        timestamp: '2025-08-28T12:50:42.584Z'
      }
    }
  })
  async getProcessingStats() {
    return this.consumerService.getProcessingStats();
  }
}
