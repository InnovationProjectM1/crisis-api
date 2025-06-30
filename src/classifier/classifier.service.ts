import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from 'typeorm';
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

  async createMultiple(createClassifierDtos: CreateClassifierDto[]): Promise<Classifier[]> {
    // Check all members present in the classifier
    const missingClassifiedGroup: CreateClassifierDto[] = [];
    const missingClassifiedSubGroup: CreateClassifierDto[] = [];
    const missingDifficulty: CreateClassifierDto[] = [];

    createClassifierDtos.forEach((dto: CreateClassifierDto): void => {
      if (!dto.tweet_id) {
        throw new BadRequestException(
          'Missing tweet_id in following classifier: ' + JSON.stringify(dto),
        );
      }
      if (!dto.classified_group) {
        missingClassifiedGroup.push(dto);
      }
      if (!dto.classified_sub_group) {
        missingClassifiedSubGroup.push(dto);
      }
      if (!dto.difficulty) {
        missingDifficulty.push(dto);
      }
    });

    if (missingClassifiedGroup.length > 0) {
      throw new BadRequestException(
        'Missing classified_group in following classifiers: ' +
          JSON.stringify(missingClassifiedGroup),
      );
    }

    if (missingClassifiedSubGroup.length > 0) {
      throw new BadRequestException(
        'Missing classified_sub_group in following classifiers: ' +
          JSON.stringify(missingClassifiedSubGroup),
      );
    }

    if (missingDifficulty.length > 0) {
      throw new BadRequestException(
        'Missing difficulty in following classifiers: ' + JSON.stringify(missingDifficulty),
      );
    }

    // Check if all tweets exist in tweets table
    const tweetIds = createClassifierDtos.map((dto: CreateClassifierDto): string => dto.tweet_id);

    // if tweets are not found, throw an error
    const existingTweets = await this.classifierRepository.manager
      .getRepository('Tweet')
      .createQueryBuilder('tweet')
      .where('tweet.tweet_id IN (:...tweetIds)', { tweetIds })
      .getMany();

    const existingTweetIds = existingTweets.map((tweet: ObjectLiteral): string => tweet.tweet_id);
    const missingTweetIds = tweetIds.filter(
      (id: string): boolean => !existingTweetIds.includes(id),
    );

    if (missingTweetIds.length > 0) {
      throw new BadRequestException(
        `The following tweet IDs do not exist in table Tweets: ${missingTweetIds.join(', ')}`,
      );
    }

    // Find if there is any duplicate tweet_id in the input
    const duplicateTweetIds = createClassifierDtos
      .map((dto: CreateClassifierDto): string => dto.tweet_id)
      .filter((id: string, index: number, self: string[]): boolean => self.indexOf(id) !== index);

    if (duplicateTweetIds.length > 0) {
      throw new BadRequestException(
        `The following tweet IDs are duplicated in request: ${duplicateTweetIds.join(', ')}`,
      );
    }

    const classifiers = this.classifierRepository.create(createClassifierDtos);
    return await this.classifierRepository.save(classifiers);
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
