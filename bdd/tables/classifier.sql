CREATE TABLE IF NOT EXISTS crisis.classifier (
    tweet_id numeric PRIMARY KEY,
    classified_group VARCHAR(50) NOT NULL,
    classified_sub_group VARCHAR(50) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    CONSTRAINT fk_tweet_id
        FOREIGN KEY (tweet_id)
        REFERENCES crisis.tweets(tweet_id)
        ON DELETE CASCADE
);