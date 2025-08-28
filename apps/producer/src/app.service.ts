import { Injectable, Logger } from '@nestjs/common';
import { RabbitMQService } from '@app/rabbitmq';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async simulateXRayData(): Promise<void> {
    const deviceIds = [
      '66bb584d4ae73e488c30a072',
      '77cc695e5bf84f599d41b183',
      '88dd7a6f6cg95g6aae52c294',
    ];

    for (const deviceId of deviceIds) {
      const xRayData = this.generateXRayData(deviceId);
      
      try {
        await this.rabbitMQService.publishMessage('x-ray-queue', xRayData);
        this.logger.log(`Published x-ray data for device: ${deviceId}`);
      } catch (error) {
        this.logger.error(`Failed to publish data for device ${deviceId}:`, error);
      }
    }
  }

  private generateXRayData(deviceId: string): any {
    const dataPoints: any[] = [];
    const numPoints = Math.floor(Math.random() * 50) + 10; // 10-60 data points
    
    for (let i = 0; i < numPoints; i++) {
      const time = i * 1000 + Math.random() * 100; // Time in milliseconds
      const x = 51.339764 + (Math.random() - 0.5) * 0.01; // X coordinate with small variation
      const y = 12.339223 + (Math.random() - 0.5) * 0.01; // Y coordinate with small variation
      const speed = Math.random() * 3 + 0.5; // Speed between 0.5 and 3.5

      dataPoints.push([
        time,
        [x, y, speed]
      ]);
    }

    return {
      [deviceId]: {
        data: dataPoints,
        time: Date.now()
      }
    };
  }

  async startSimulation(intervalMs: number = 5000): Promise<void> {
    this.logger.log(`Starting x-ray data simulation with ${intervalMs}ms interval`);
    
    setInterval(async () => {
      await this.simulateXRayData();
    }, intervalMs);
  }
}
