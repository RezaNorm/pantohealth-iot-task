import { ApiProperty } from '@nestjs/swagger';

export class DeviceData {
  @ApiProperty({
    description: 'Array of data points with time and coordinates',
    example: [
      [762, [51.339764, 12.339223833333334, 1.2038000000000002]],
      [1766, [51.33977733333333, 12.339211833333334, 1.531604]],
      [2763, [51.339782, 12.339196166666667, 2.13906]]
    ]
  })
  data: Array<[number, [number, number, number]]>;

  @ApiProperty({
    description: 'Timestamp when the data was collected',
    example: 1735683480000
  })
  time: number;
}

export class ProcessXRayDataDto {
  @ApiProperty({
    description: 'X-ray data from IoT device with device ID as the top-level key'
  })
  data: DeviceData;
}
