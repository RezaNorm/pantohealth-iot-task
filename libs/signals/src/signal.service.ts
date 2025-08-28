import { Injectable, Logger } from '@nestjs/common';
import { MongoService } from '@app/mongo';
import { XRaySignal } from '@app/mongo/schemas/xray-signal.schema';

export interface ProcessedXRayData {
  deviceId: string;
  timestamp: number;
  dataLength: number;
  dataVolume: number;
  rawData: any;
}

@Injectable()
export class SignalService {
  private readonly logger = new Logger(SignalService.name);

  constructor(private readonly mongoService: MongoService) {}

  async processXRayData(rawData: any): Promise<ProcessedXRayData> {
    try {
      // Extract device ID from the raw data
      const deviceId = Object.keys(rawData)[0];
      const deviceData = rawData[deviceId];

      if (!deviceData || !deviceData.data || !deviceData.time) {
        throw new Error('Invalid x-ray data format');
      }

      // Calculate data length (number of data points)
      const dataLength = deviceData.data.length;

      // Calculate data volume (size in bytes)
      const dataVolume = JSON.stringify(deviceData).length;

      const processedData: ProcessedXRayData = {
        deviceId,
        timestamp: deviceData.time,
        dataLength,
        dataVolume,
        rawData: deviceData,
      };

      this.logger.log(`Processed x-ray data for device ${deviceId}: ${dataLength} data points, ${dataVolume} bytes`);
      
      return processedData;
    } catch (error) {
      this.logger.error('Error processing x-ray data', error);
      throw error;
    }
  }

  async saveSignal(processedData: ProcessedXRayData): Promise<XRaySignal> {
    try {
      const signalData = {
        ...processedData,
        status: 'processed',
        processedAt: new Date(),
      };

      const savedSignal = await this.mongoService.createSignal(signalData);
      this.logger.log(`Saved signal for device ${processedData.deviceId} with ID: ${(savedSignal as any)._id}`);
      
      return savedSignal;
    } catch (error) {
      this.logger.error('Error saving signal', error);
      throw error;
    }
  }

  async getAllSignals(): Promise<XRaySignal[]> {
    return this.mongoService.findAllSignals();
  }

  async getSignalById(id: string): Promise<XRaySignal | null> {
    return this.mongoService.findSignalById(id);
  }

  async getSignalsByDeviceId(deviceId: string): Promise<XRaySignal[]> {
    return this.mongoService.findSignalsByDeviceId(deviceId);
  }

  async getSignalsByDateRange(startDate: Date, endDate: Date): Promise<XRaySignal[]> {
    return this.mongoService.findSignalsByDateRange(startDate, endDate);
  }

  async updateSignal(id: string, updateData: Partial<XRaySignal>): Promise<XRaySignal | null> {
    return this.mongoService.updateSignal(id, updateData);
  }

  async deleteSignal(id: string): Promise<XRaySignal | null> {
    return this.mongoService.deleteSignal(id);
  }

  async getSignalStatistics(): Promise<any> {
    const stats = await this.mongoService.getSignalStats();
    return stats[0] || {
      totalSignals: 0,
      avgDataLength: 0,
      avgDataVolume: 0,
      totalDataVolume: 0,
    };
  }
}
