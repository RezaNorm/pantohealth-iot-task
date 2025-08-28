import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoService } from './mongo.service';
import { XRaySignal, XRaySignalSchema } from './schemas/xray-signal.schema';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/xray-iot'),
    MongooseModule.forFeature([
      { name: XRaySignal.name, schema: XRaySignalSchema },
    ]),
  ],
  providers: [MongoService],
  exports: [MongoService, MongooseModule],
})
export class MongoModule {}
