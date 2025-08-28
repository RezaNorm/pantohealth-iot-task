import { Module } from '@nestjs/common';
import { ConsumerController } from './consumer.controller';
import { ConsumerService } from './consumer.service';
import { RabbitMQModule } from '@app/rabbitmq';
import { SignalModule } from '@app/signals';

@Module({
  imports: [RabbitMQModule, SignalModule],
  controllers: [ConsumerController],
  providers: [ConsumerService],
})
export class ConsumerModule {}
