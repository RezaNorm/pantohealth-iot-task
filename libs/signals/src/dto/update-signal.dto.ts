import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSignalDto {
  @ApiProperty({ 
    description: 'Processing status', 
    example: 'processed',
    required: false 
  })
  @IsOptional()
  @IsString()
  status?: string;
}
