import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type XRaySignalDocument = XRaySignal & Document;

@Schema({ timestamps: true })
export class XRaySignal {
  @Prop({ required: true, index: true })
  deviceId: string;

  @Prop({ required: true })
  timestamp: number;

  @Prop({ required: true })
  dataLength: number;

  @Prop({ required: true })
  dataVolume: number;

  @Prop({ type: Object, required: true })
  rawData: any;

  @Prop({ default: Date.now })
  processedAt: Date;

  @Prop()
  status: string;
}

export const XRaySignalSchema = SchemaFactory.createForClass(XRaySignal);
