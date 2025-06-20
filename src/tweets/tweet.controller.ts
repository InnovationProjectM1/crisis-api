import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { Statistics, TweetService } from './tweet.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { Tweet } from './tweet.entity';

@Controller('tweets')
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  @Post()
  create(@Body() createTweetDto: CreateTweetDto): Promise<Tweet> {
    return this.tweetService.create(createTweetDto);
  }

  @Get()
  findAll(): Promise<Tweet[]> {
    return this.tweetService.findAll();
  }

  @Get('statistics')
  getStatistics(): Promise<Statistics> {
    return this.tweetService.getStatistics();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Tweet> {
    const tweet = await this.tweetService.findOne(+id);
    if (!tweet) {
      throw new NotFoundException(`Tweet with ID ${id} not found`);
    }
    return tweet;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTweetDto: UpdateTweetDto): Promise<Tweet> {
    const tweet = await this.tweetService.update(+id, updateTweetDto);
    if (!tweet) {
      throw new NotFoundException(`Tweet with ID ${id} not found`);
    }
    return tweet;
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.tweetService.remove(+id);
  }
}
