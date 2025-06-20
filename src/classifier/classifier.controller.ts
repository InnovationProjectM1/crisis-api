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
import { ClassifierService, DifficultyStatistics, GroupStatistics } from './classifier.service';
import { CreateClassifierDto } from './dto/create-classifier.dto';
import { UpdateClassifierDto } from './dto/update-classifier.dto';
import { Classifier } from './classifier.entity';

@Controller('classifiers')
export class ClassifierController {
  constructor(private readonly classifierService: ClassifierService) {}

  @Post()
  create(@Body() createClassifierDto: CreateClassifierDto): Promise<Classifier> {
    return this.classifierService.create(createClassifierDto);
  }

  @Get()
  findAll(): Promise<Classifier[]> {
    return this.classifierService.findAll();
  }

  @Get('statistics/groups')
  getGroupStatistics(): Promise<GroupStatistics[]> {
    return this.classifierService.getGroupStatistics();
  }

  @Get('statistics/difficulty')
  getDifficultyStatistics(): Promise<DifficultyStatistics[]> {
    return this.classifierService.getDifficultyStatistics();
  }

  @Get(':tweetId')
  async findOne(@Param('tweetId') tweetId: string): Promise<Classifier> {
    const classifier = await this.classifierService.findOne(+tweetId);
    if (!classifier) {
      throw new NotFoundException(`Classifier for tweet ID ${tweetId} not found`);
    }
    return classifier;
  }

  @Patch(':tweetId')
  async update(
    @Param('tweetId') tweetId: string,
    @Body() updateClassifierDto: UpdateClassifierDto,
  ): Promise<Classifier> {
    const classifier = await this.classifierService.update(+tweetId, updateClassifierDto);
    if (!classifier) {
      throw new NotFoundException(`Classifier for tweet ID ${tweetId} not found`);
    }
    return classifier;
  }

  @Delete(':tweetId')
  remove(@Param('tweetId') tweetId: string): Promise<void> {
    return this.classifierService.remove(+tweetId);
  }
}
