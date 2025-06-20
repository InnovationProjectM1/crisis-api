import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classifier } from './classifier.entity';
import { CreateClassifierDto } from './dto/create-classifier.dto';
import { UpdateClassifierDto } from './dto/update-classifier.dto';

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

  async findOne(tweetId: number): Promise<Classifier | null> {
    return await this.classifierRepository.findOne({
      where: { tweet_id: tweetId },
      relations: ['tweet'],
    });
  }

  async update(
    tweetId: number,
    updateClassifierDto: UpdateClassifierDto,
  ): Promise<Classifier | null> {
    await this.classifierRepository.update({ tweet_id: tweetId }, updateClassifierDto);
    return this.findOne(tweetId);
  }

  async remove(tweetId: number): Promise<void> {
    await this.classifierRepository.delete({ tweet_id: tweetId });
  }

  async getGroupStatistics() {
    const groupStats = await this.classifierRepository
      .createQueryBuilder('classifier')
      .select('classifier.classified_group', 'group')
      .addSelect('COUNT(*)', 'count')
      .groupBy('classifier.classified_group')
      .getRawMany();

    return groupStats;
  }

  async getDifficultyStatistics() {
    const difficultyStats = await this.classifierRepository
      .createQueryBuilder('classifier')
      .select('classifier.difficulty', 'difficulty')
      .addSelect('COUNT(*)', 'count')
      .groupBy('classifier.difficulty')
      .getRawMany();

    return difficultyStats;
  }
}
