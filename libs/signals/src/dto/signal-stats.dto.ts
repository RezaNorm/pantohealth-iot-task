import { ApiProperty } from '@nestjs/swagger';

export class SignalStatsDto {
  @ApiProperty({ description: 'Total number of signals', example: 3 })
  totalSignals: number;

  @ApiProperty({ description: 'Average data length', example: 34.33 })
  avgDataLength: number;

  @ApiProperty({ description: 'Average data volume in bytes', example: 2708.67 })
  avgDataVolume: number;

  @ApiProperty({ description: 'Total data volume in bytes', example: 8126 })
  totalDataVolume: number;
}
