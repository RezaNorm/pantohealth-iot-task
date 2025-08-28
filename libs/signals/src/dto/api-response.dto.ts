import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ description: 'Success status', example: true })
  success: boolean;

  @ApiProperty({ description: 'Response data' })
  data: T;

  @ApiProperty({ description: 'Response message', example: 'Operation completed successfully' })
  message?: string;

  @ApiProperty({ description: 'Number of items (for list responses)', example: 3 })
  count?: number;
}
