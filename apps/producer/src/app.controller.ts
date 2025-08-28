import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Producer')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Health check',
    description: 'Check if the producer service is running'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Service is running',
    schema: {
      example: 'X-Ray IoT Producer Service'
    }
  })
  getHello(): string {
    return 'X-Ray IoT Producer Service';
  }

  @Post('simulate')
  @ApiOperation({ 
    summary: 'Simulate X-ray data',
    description: 'Generate and send x-ray data for all configured devices once'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Simulation completed successfully',
    schema: {
      example: {
        message: 'X-ray data simulation completed'
      }
    }
  })
  async simulateXRayData(): Promise<{ message: string }> {
    await this.appService.simulateXRayData();
    return { message: 'X-ray data simulation completed' };
  }

  @Post('start-simulation')
  @ApiOperation({ 
    summary: 'Start continuous simulation',
    description: 'Start continuous x-ray data generation with specified interval'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        intervalMs: {
          type: 'number',
          description: 'Interval between simulations in milliseconds',
          example: 5000,
          default: 5000
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Simulation started successfully',
    schema: {
      example: {
        message: 'X-ray data simulation started with 5000ms interval'
      }
    }
  })
  async startSimulation(@Body() body: { intervalMs?: number }): Promise<{ message: string }> {
    const intervalMs = body.intervalMs || 5000;
    await this.appService.startSimulation(intervalMs);
    return { message: `X-ray data simulation started with ${intervalMs}ms interval` };
  }
}
