import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from '@app/rabbitmq';
import { SignalService } from '@app/signals';

@Injectable()
export class ConsumerService implements OnModuleInit {
  private readonly logger = new Logger(ConsumerService.name);

  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly signalService: SignalService,
  ) {}

  async onModuleInit() {
    await this.startConsuming();
  }

  private async startConsuming(): Promise<void> {
    try {
      await this.rabbitMQService.consumeMessages('x-ray-queue', async (message) => {
        await this.processXRayMessage(message);
      });
      this.logger.log('Started consuming x-ray messages from RabbitMQ');
    } catch (error) {
      this.logger.error('Failed to start consuming messages', error);
    }
  }

  private async processXRayMessage(message: any): Promise<void> {
    try {
      this.logger.log('Processing x-ray message');
      
      // Process the x-ray data
      const processedData = await this.signalService.processXRayData(message);
      
      // Save to database
      const savedSignal = await this.signalService.saveSignal(processedData);
      
      this.logger.log(`Successfully processed and saved x-ray data for device: ${processedData.deviceId}, Signal ID: ${savedSignal['_id']}`);
    } catch (error) {
      this.logger.error('Error processing x-ray message', error);
      // In a production environment, you might want to send failed messages to a dead letter queue
      throw error;
    }
  }

  async getProcessingStats(): Promise<any> {
    try {
      const stats = await this.signalService.getSignalStatistics();
      return {
        message: 'Consumer processing statistics',
        stats,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error getting processing stats', error);
      throw error;
    }
  }
}
