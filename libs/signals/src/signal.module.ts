import { Module } from '@nestjs/common';
import { MongoModule } from '@app/mongo';
import { SignalService } from './signal.service';
import { SignalController } from './signal.controller';

@Module({
  imports: [MongoModule],
  controllers: [SignalController],
  providers: [SignalService],
  exports: [SignalService],
})
export class SignalModule {}
