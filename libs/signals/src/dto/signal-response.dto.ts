import { ApiProperty } from '@nestjs/swagger';

export class SignalResponseDto {
  @ApiProperty({ description: 'Signal ID', example: '68b050a2a382a0eecbe9f400' })
  _id: string;

  @ApiProperty({ description: 'Device ID', example: '66bb584d4ae73e488c30a072' })
  deviceId: string;

  @ApiProperty({ description: 'Timestamp', example: 1756385442575 })
  timestamp: number;

  @ApiProperty({ description: 'Number of data points', example: 36 })
  dataLength: number;

  @ApiProperty({ description: 'Data size in bytes', example: 2841 })
  dataVolume: number;

  @ApiProperty({ description: 'Raw x-ray data' })
  rawData: any;

  @ApiProperty({ description: 'Processing timestamp', example: '2025-08-28T12:50:42.584Z' })
  processedAt: string;

  @ApiProperty({ description: 'Processing status', example: 'processed' })
  status: string;

  @ApiProperty({ description: 'Creation timestamp', example: '2025-08-28T12:50:42.589Z' })
  createdAt: string;

  @ApiProperty({ description: 'Last update timestamp', example: '2025-08-28T12:50:42.589Z' })
  updatedAt: string;
}
