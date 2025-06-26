import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTweetDto {
  @IsNotEmpty({ message: 'Tweet ID must not be empty' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Tweet ID must be a valid number' },
  )
  @ApiProperty({ example: 1234567890, description: 'Unique Tweet ID' })
  tweet_id: string;

  @IsString({ message: 'Tweet value must be a string' })
  @IsNotEmpty({ message: 'Tweet text must not be empty' })
  @ApiProperty({ example: 'Example tweet text', description: 'The content of the tweet' })
  tweet_text: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    description: 'Timestamp of the tweet creation',
    required: false,
  })
  timestamp?: Date;
}
