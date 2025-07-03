import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClassifierDto {
  @IsNotEmpty({ message: 'Tweet ID is required' })
  @IsString({ message: 'Tweet ID must be a string' })
  @ApiProperty({ example: '1234567890', description: 'Associated Tweet ID' })
  tweet_id: string;

  @IsNotEmpty({ message: 'Classified group is required' })
  @IsString({ message: 'Classified group must be a string' })
  @ApiProperty({ example: 'Emergency', description: 'Main classified group' })
  classified_group: string;

  @IsNotEmpty({ message: 'Classified sub-group is required' })
  @IsString({ message: 'Classified sub-group must be a string' })
  @ApiProperty({ example: 'Food', description: 'Sub-group of the classified group' })
  classified_sub_group: string;

  @IsNotEmpty({ message: 'Severity level is required' })
  @IsString({ message: 'Severity must be a string' })
  @ApiProperty({ example: '1', description: 'Classification severity level (1 - 5)' })
  severity: string;
}
