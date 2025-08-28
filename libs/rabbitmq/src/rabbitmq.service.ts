import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQService.name);
  private connection: any = null;
  private channel: any = null;

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
      this.channel = await this.connection.createChannel();
      
      // Assert the x-ray queue
      await this.channel.assertQueue('x-ray-queue', {
        durable: true,
      });

      this.logger.log('Connected to RabbitMQ and asserted x-ray-queue');
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ', error);
      throw error;
    }
  }

  private async disconnect(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      this.logger.log('Disconnected from RabbitMQ');
    } catch (error) {
      this.logger.error('Error disconnecting from RabbitMQ', error);
    }
  }

  async publishMessage(queue: string, message: any): Promise<void> {
    try {
      if (!this.channel) {
        throw new Error('RabbitMQ channel not available');
      }
      const messageBuffer = Buffer.from(JSON.stringify(message));
      await this.channel.sendToQueue(queue, messageBuffer, {
        persistent: true,
      });
      this.logger.log(`Message published to queue: ${queue}`);
    } catch (error) {
      this.logger.error(`Failed to publish message to queue: ${queue}`, error);
      throw error;
    }
  }

  async consumeMessages(queue: string, callback: (message: any) => Promise<void>): Promise<void> {
    try {
      if (!this.channel) {
        throw new Error('RabbitMQ channel not available');
      }
      await this.channel.consume(queue, async (msg: any) => {
        if (msg && this.channel) {
          try {
            const message = JSON.parse(msg.content.toString());
            await callback(message);
            this.channel.ack(msg);
          } catch (error) {
            this.logger.error('Error processing message', error);
            this.channel.nack(msg, false, false);
          }
        }
      });
      this.logger.log(`Started consuming messages from queue: ${queue}`);
    } catch (error) {
      this.logger.error(`Failed to consume messages from queue: ${queue}`, error);
      throw error;
    }
  }

  getChannel(): any {
    return this.channel;
  }

  getConnection(): any {
    return this.connection;
  }
}