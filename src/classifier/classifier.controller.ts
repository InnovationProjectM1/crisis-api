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
import { ClassifierService, DifficultyStatistics, GroupStatistics } from './classifier.service';
import { CreateClassifierDto } from './dto/create-classifier.dto';
import { UpdateClassifierDto } from './dto/update-classifier.dto';
import { Classifier } from './classifier.entity';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('classifiers')
export class ClassifierController {
  constructor(private readonly classifierService: ClassifierService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new classifier for a tweet' })
  @ApiResponse({ status: 201, description: 'The classifier has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 404, description: 'Tweet not found.' })
  @ApiBody({ type: CreateClassifierDto })
  create(@Body() createClassifierDto: CreateClassifierDto): Promise<Classifier> {
    return this.classifierService.create(createClassifierDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all classifiers' })
  @ApiResponse({ status: 200, description: 'List of all classifiers.' })
  @ApiResponse({ status: 404, description: 'No classifiers found.' })
  findAll(): Promise<Classifier[]> {
    return this.classifierService.findAll();
  }

  @Get('statistics/groups')
  @ApiOperation({ summary: 'Retrieve statistics about classified groups' })
  @ApiResponse({ status: 200, description: 'Statistics about classified groups.' })
  getGroupStatistics(): Promise<GroupStatistics[]> {
    return this.classifierService.getGroupStatistics();
  }

  @Get('statistics/difficulty')
  @ApiOperation({ summary: 'Retrieve statistics about classification difficulty' })
  @ApiResponse({ status: 200, description: 'Statistics about classification difficulty.' })
  getDifficultyStatistics(): Promise<DifficultyStatistics[]> {
    return this.classifierService.getDifficultyStatistics();
  }

  @Get(':tweetId')
  @ApiOperation({ summary: 'Retrieve a classifier by tweet ID' })
  @ApiResponse({ status: 200, description: 'The classifier has been successfully retrieved.' })
  @ApiResponse({ status: 404, description: 'Classifier not found.' })
  async findOne(@Param('tweetId') tweetId: string): Promise<Classifier> {
    const classifier = await this.classifierService.findOne(tweetId);
    if (!classifier) {
      throw new NotFoundException(`Classifier for tweet ID ${tweetId} not found`);
    }
    return classifier;
  }

  @Patch(':tweetId')
  @ApiOperation({ summary: 'Update a classifier by tweet ID' })
  @ApiResponse({ status: 200, description: 'The classifier has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Classifier not found.' })
  @ApiBody({ type: UpdateClassifierDto })
  async update(
    @Param('tweetId') tweetId: string,
    @Body() updateClassifierDto: UpdateClassifierDto,
  ): Promise<Classifier> {
    const classifier = await this.classifierService.update(tweetId, updateClassifierDto);
    if (!classifier) {
      throw new NotFoundException(`Classifier for tweet ID ${tweetId} not found`);
    }
    return classifier;
  }

  @Delete(':tweetId')
  @ApiOperation({ summary: 'Delete a classifier by tweet ID' })
  @ApiResponse({ status: 204, description: 'The classifier has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Classifier not found.' })
  @HttpCode(204)
  remove(@Param('tweetId') tweetId: string): Promise<void> {
    return this.classifierService.remove(tweetId);
  }
}
