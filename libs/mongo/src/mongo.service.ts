import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { XRaySignal, XRaySignalDocument } from './schemas/xray-signal.schema';

@Injectable()
export class MongoService {
  constructor(
    @InjectModel(XRaySignal.name)
    private xRaySignalModel: Model<XRaySignalDocument>,
  ) {}

  async createSignal(signalData: Partial<XRaySignal>): Promise<XRaySignal> {
    const signal = new this.xRaySignalModel(signalData);
    return signal.save();
  }

  async findAllSignals(): Promise<XRaySignal[]> {
    return this.xRaySignalModel.find().exec();
  }

  async findSignalById(id: string): Promise<XRaySignal | null> {
    return this.xRaySignalModel.findById(id).exec();
  }

  async findSignalsByDeviceId(deviceId: string): Promise<XRaySignal[]> {
    return this.xRaySignalModel.find({ deviceId }).exec();
  }

  async findSignalsByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<XRaySignal[]> {
    return this.xRaySignalModel
      .find({
        timestamp: {
          $gte: startDate.getTime(),
          $lte: endDate.getTime(),
        },
      })
      .exec();
  }

  async updateSignal(id: string, updateData: Partial<XRaySignal>): Promise<XRaySignal | null> {
    return this.xRaySignalModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async deleteSignal(id: string): Promise<XRaySignal | null> {
    return this.xRaySignalModel.findByIdAndDelete(id).exec();
  }

  async getSignalStats(): Promise<any> {
    return this.xRaySignalModel.aggregate([
      {
        $group: {
          _id: null,
          totalSignals: { $sum: 1 },
          avgDataLength: { $avg: '$dataLength' },
          avgDataVolume: { $avg: '$dataVolume' },
          totalDataVolume: { $sum: '$dataVolume' },
        },
      },
    ]);
  }
}
