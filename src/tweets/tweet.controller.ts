import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  HttpCode,
} from '@nestjs/common';
import { Statistics, TweetService } from './tweet.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { Tweet } from './tweet.entity';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('tweets')
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tweet' })
  @ApiResponse({ status: 201, description: 'The tweet has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiBody({ type: CreateTweetDto })
  create(@Body() createTweetDto: CreateTweetDto): Promise<Tweet> {
    return this.tweetService.create(createTweetDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all tweets' })
  @ApiResponse({ status: 200, description: 'List of all tweets.' })
  @ApiResponse({ status: 404, description: 'No tweets found.' })
  findAll(): Promise<Tweet[]> {
    return this.tweetService.findAll();
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Retrieve statistics about tweets' })
  @ApiResponse({ status: 200, description: 'Statistics about tweets.' })
  @ApiResponse({ status: 404, description: 'No statistics found.' })
  getStatistics(): Promise<Statistics> {
    return this.tweetService.getStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a tweet by ID' })
  @ApiResponse({ status: 200, description: 'The tweet has been successfully retrieved.' })
  @ApiResponse({ status: 404, description: 'Tweet not found.' })
  async findOne(@Param('id') id: string): Promise<Tweet> {
    const tweet = await this.tweetService.findOne(id);
    if (!tweet) {
      throw new NotFoundException(`Tweet with ID ${id} not found`);
    }
    return tweet;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a tweet by ID' })
  @ApiResponse({ status: 200, description: 'The tweet has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Tweet not found.' })
  @ApiBody({ type: UpdateTweetDto })
  async update(@Param('id') id: string, @Body() updateTweetDto: UpdateTweetDto): Promise<Tweet> {
    const tweet = await this.tweetService.update(id, updateTweetDto);
    if (!tweet) {
      throw new NotFoundException(`Tweet with ID ${id} not found`);
    }
    return tweet;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a tweet by ID' })
  @ApiResponse({ status: 204, description: 'The tweet has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Tweet not found.' })
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    const tweet = await this.tweetService.findOne(id);
    if (!tweet) {
      throw new NotFoundException(`Tweet with ID ${id} not found`);
    }
    return this.tweetService.remove(id);
  }
}
