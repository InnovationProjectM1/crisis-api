import { Entity, Column, PrimaryColumn, OneToOne } from 'typeorm';
import { Classifier } from '../classifier/classifier.entity';

@Entity({ schema: 'crisis', name: 'tweets' })
export class Tweet {
  @PrimaryColumn({ type: 'numeric' })
  tweet_id: string;

  @Column({ type: 'varchar', length: 256 })
  tweet_text: string;

  @Column({ type: 'timestamp', default: '1970-01-01 00:00:00' })
  timestamp: Date;

  @OneToOne(
    (): typeof Classifier => Classifier,
    (classifier: Classifier): Tweet => classifier.tweet,
  )
  classifier?: Classifier;
}
