import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tweet } from './tweet.entity';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';

export interface Statistics {
  total: number;
  classified: number;
  unclassified: number;
}

@Injectable()
export class TweetService {
  constructor(
    @InjectRepository(Tweet)
    private tweetRepository: Repository<Tweet>,
  ) {}

  async create(createTweetDto: CreateTweetDto): Promise<Tweet> {
    const tweet = this.tweetRepository.create(createTweetDto);
    return await this.tweetRepository.save(tweet);
  }

  async findAll(): Promise<Tweet[]> {
    return await this.tweetRepository.find({
      relations: ['classifier'],
    });
  }
  async findOne(id: string): Promise<Tweet | null> {
    return await this.tweetRepository.findOne({
      where: { tweet_id: id },
      relations: ['classifier'],
    });
  }
  async update(id: string, updateTweetDto: UpdateTweetDto): Promise<Tweet | null> {
    await this.tweetRepository.update({ tweet_id: id }, updateTweetDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.tweetRepository.delete({ tweet_id: id });
  }

  async getStatistics(): Promise<Statistics> {
    const total = await this.tweetRepository.count();
    const classified = await this.tweetRepository
      .createQueryBuilder('tweet')
      .leftJoin('tweet.classifier', 'classifier')
      .where('classifier.tweet_id IS NOT NULL')
      .getCount();

    return {
      total,
      classified,
      unclassified: total - classified,
    };
  }
}
