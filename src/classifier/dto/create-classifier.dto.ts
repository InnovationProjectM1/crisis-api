import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClassifierDto {
  @IsNotEmpty({ message: 'Tweet ID is required' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Tweet ID must be a valid number' },
  )
  @ApiProperty({ example: 1234567890, description: 'Associated Tweet ID' })
  tweet_id: string;

  @IsNotEmpty({ message: 'Classified group is required' })
  @IsString({ message: 'Classified group must be a string' })
  @ApiProperty({ example: 'Emergency', description: 'Main classified group' })
  classified_group: string;

  @IsNotEmpty({ message: 'Classified sub-group is required' })
  @IsString({ message: 'Classified sub-group must be a string' })
  @ApiProperty({ example: 'Food', description: 'Sub-group of the classified group' })
  classified_sub_group: string;

  @IsNotEmpty({ message: 'Difficulty level is required' })
  @IsString({ message: 'Difficulty must be a string' })
  @ApiProperty({ example: 'High', description: 'Classification difficulty level' })
  difficulty: string;
}
