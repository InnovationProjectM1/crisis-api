import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateTweetDto {
  @IsNotEmpty()
  @IsNumber()
  tweet_id: number;

  @IsNotEmpty()
  @IsString()
  tweet_text: string;

  @IsOptional()
  @IsDateString()
  timestamp?: Date;
}
