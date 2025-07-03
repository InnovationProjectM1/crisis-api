import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { Tweet } from '../tweets/tweet.entity';

@Entity({ schema: 'crisis', name: 'classifier' })
export class Classifier {
  @PrimaryColumn({ type: 'numeric' })
  tweet_id: string;

  @Column({ type: 'varchar', length: 50 })
  classified_group: string;

  @Column({ type: 'varchar', length: 50 })
  classified_sub_group: string;

  @Column({ type: 'varchar', length: 50 })
  severity: string;

  @OneToOne((): typeof Tweet => Tweet, (tweet: Tweet): Classifier | undefined => tweet.classifier)
  @JoinColumn({ name: 'tweet_id' })
  tweet: Tweet;
}
