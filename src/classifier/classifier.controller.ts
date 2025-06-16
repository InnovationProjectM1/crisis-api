import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { ClassifierService } from './classifier.service';
import { CreateClassifierDto } from './dto/create-classifier.dto';
import { UpdateClassifierDto } from './dto/update-classifier.dto';

@Controller('classifiers')
export class ClassifierController {
  constructor(private readonly classifierService: ClassifierService) {}

  @Post()
  create(@Body() createClassifierDto: CreateClassifierDto) {
    return this.classifierService.create(createClassifierDto);
  }

  @Get()
  findAll() {
    return this.classifierService.findAll();
  }

  @Get('statistics/groups')
  getGroupStatistics() {
    return this.classifierService.getGroupStatistics();
  }

  @Get('statistics/difficulty')
  getDifficultyStatistics() {
    return this.classifierService.getDifficultyStatistics();
  }

  @Get(':tweetId')
  async findOne(@Param('tweetId') tweetId: string) {
    const classifier = await this.classifierService.findOne(+tweetId);
    if (!classifier) {
      throw new NotFoundException(`Classifier for tweet ID ${tweetId} not found`);
    }
    return classifier;
  }

  @Patch(':tweetId')
  async update(@Param('tweetId') tweetId: string, @Body() updateClassifierDto: UpdateClassifierDto) {
    const classifier = await this.classifierService.update(+tweetId, updateClassifierDto);
    if (!classifier) {
      throw new NotFoundException(`Classifier for tweet ID ${tweetId} not found`);
    }
    return classifier;
  }

  @Delete(':tweetId')
  remove(@Param('tweetId') tweetId: string) {
    return this.classifierService.remove(+tweetId);
  }
}
