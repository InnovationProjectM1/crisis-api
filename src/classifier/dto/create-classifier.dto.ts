import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateClassifierDto {
  @IsNotEmpty()
  @IsNumber()
  tweet_id: number;

  @IsNotEmpty()
  @IsString()
  classified_group: string;

  @IsNotEmpty()
  @IsString()
  classified_sub_group: string;

  @IsNotEmpty()
  @IsString()
  difficulty: string;
}
