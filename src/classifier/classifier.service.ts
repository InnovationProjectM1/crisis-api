import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classifier } from './classifier.entity';
import { CreateClassifierDto } from './dto/create-classifier.dto';
import { UpdateClassifierDto } from './dto/update-classifier.dto';

export interface GroupStatistics {
  group: string;
  count: number;
}

export interface DifficultyStatistics {
  difficulty: string;
  count: number;
}

@Injectable()
export class ClassifierService {
  constructor(
    @InjectRepository(Classifier)
    private classifierRepository: Repository<Classifier>,
  ) {}

  async create(createClassifierDto: CreateClassifierDto): Promise<Classifier> {
    const classifier = this.classifierRepository.create(createClassifierDto);
    return await this.classifierRepository.save(classifier);
  }

  async findAll(): Promise<Classifier[]> {
    return await this.classifierRepository.find({
      relations: ['tweet'],
    });
  }

  async findOne(tweetId: string): Promise<Classifier | null> {
    return await this.classifierRepository.findOne({
      where: { tweet_id: tweetId },
      relations: ['tweet'],
    });
  }

  async update(
    tweetId: string,
    updateClassifierDto: UpdateClassifierDto,
  ): Promise<Classifier | null> {
    await this.classifierRepository.update({ tweet_id: tweetId }, updateClassifierDto);
    return this.findOne(tweetId);
  }

  async remove(tweetId: string): Promise<void> {
    await this.classifierRepository.delete({ tweet_id: tweetId });
  }

  async getGroupStatistics(): Promise<GroupStatistics[]> {
    return await this.classifierRepository
      .createQueryBuilder('classifier')
      .select('classifier.classified_group', 'group')
      .addSelect('COUNT(*)', 'count')
      .groupBy('classifier.classified_group')
      .getRawMany();
  }

  async getDifficultyStatistics(): Promise<DifficultyStatistics[]> {
    return await this.classifierRepository
      .createQueryBuilder('classifier')
      .select('classifier.difficulty', 'difficulty')
      .addSelect('COUNT(*)', 'count')
      .groupBy('classifier.difficulty')
      .getRawMany();
  }
}
