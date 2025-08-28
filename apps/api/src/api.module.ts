import { Module } from '@nestjs/common';
import { SignalModule } from '@app/signals';
import { MongoModule } from '@app/mongo';

@Module({
  imports: [MongoModule, SignalModule],
})
export class ApiModule {}
