import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { Tweet } from '../tweets/tweet.entity';

@Entity({ schema: 'crisis', name: 'classifier' })
export class Classifier {
  @PrimaryColumn({ type: 'numeric' })
  tweet_id: number;

  @Column({ type: 'varchar', length: 50 })
  classified_group: string;

  @Column({ type: 'varchar', length: 50 })
  classified_sub_group: string;

  @Column({ type: 'varchar', length: 50 })
  difficulty: string;

  @OneToOne(() => Tweet, tweet => tweet.classifier)
  @JoinColumn({ name: 'tweet_id' })
  tweet: Tweet;
}
