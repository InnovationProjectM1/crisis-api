import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class DatabaseInitService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseInitService.name);

  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit(): Promise<void> {
    const schemaName = 'crisis';

    const result = await this.dataSource.query(
      `SELECT schema_name FROM information_schema.schemata WHERE schema_name = $1`,
      [schemaName],
    );

    if (result.length > 0) {
      this.logger.log(`Schema "${schemaName}" already exists. Init skipped.`);
      return;
    }

    this.logger.log(`Schema "${schemaName}" not found. Running script...`);

    const sqlPath = join(__dirname, 'database.sql');
    const sql = readFileSync(sqlPath, 'utf8');

    await this.dataSource.query(sql);
    this.logger.log(`Database initialized successfully.`);

    const sqlFiles = [
      join(__dirname, 'tables', 'tweets.sql'),
      join(__dirname, 'tables', 'classifier.sql'),
    ];
    for (const file of sqlFiles) {
      const tableSql = readFileSync(file, 'utf8');
      await this.dataSource.query(tableSql);
      this.logger.log(`Executed SQL file: ${file}`);
    }

    await this.insertDataset();

    this.logger.log(`All SQL files executed successfully.`);
  }

  private async insertDataset(): Promise<void> {
    const datasetChoice = process.env.DATASET_CHOICE || '1';

    this.logger.log(`Using dataset ${datasetChoice}`);

    if (datasetChoice === '1') {
      await this.insertDataset1();
    } else if (datasetChoice === '2') {
      await this.insertDataset2();
    } else {
      this.logger.warn(`Invalid dataset choice: ${datasetChoice}. Skipping dataset insertion.`);
    }
  }

  private async insertDataset1(): Promise<void> {
    const csvPath = join(__dirname, 'datasets', 'dataset1.csv');
    const csvContent = readFileSync(csvPath, 'utf8');
    const lines = csvContent.split('\n').slice(1); // Skip header

    this.logger.log(`Inserting ${lines.length - 1} tweets from dataset1...`);

    for (const line of lines) {
      if (line.trim() === '') continue;

      const row = this.parseCSVLine(line);
      if (row.length >= 4) {
        const tweetId = row[2];
        const tweetText = row[3].replace(/'/g, "''");

        try {
          await this.dataSource.query(
            `INSERT INTO crisis.tweets (tweet_id, tweet_text) VALUES ($1, $2) ON CONFLICT (tweet_id) DO NOTHING`,
            [tweetId, tweetText],
          );
        } catch (error) {
          this.logger.error(`Error inserting tweet ${tweetId}: ${error.message}`);
        }
      }
    }

    this.logger.log(`Dataset1 insertion completed.`);
  }

  private async insertDataset2(): Promise<void> {
    const csvPath = join(__dirname, 'datasets', 'dataset2.csv');
    const csvContent = readFileSync(csvPath, 'utf8');
    const lines = csvContent.split('\n').slice(1); // Skip header

    this.logger.log(`Inserting ${lines.length - 1} tweets and classifications from dataset2...`);

    for (const line of lines) {
      if (line.trim() === '') continue;

      const row = this.parseCSVLine(line);
      if (row.length >= 4) {
        const tweetId = row[1];
        const tweetText = row[2].replace(/'/g, "''"); // Escape single quotes
        const tweetClass = row[3];

        try {
          // Insert tweet
          await this.dataSource.query(
            `INSERT INTO crisis.tweets (tweet_id, tweet_text) VALUES ($1, $2) ON CONFLICT (tweet_id) DO NOTHING`,
            [tweetId, tweetText],
          );

          // Insert classifier
          await this.dataSource.query(
            `INSERT INTO crisis.classifier (tweet_id, classified_group, classified_sub_group, severity) VALUES ($1, $2, $3, $4) ON CONFLICT (tweet_id) DO NOTHING`,
            [tweetId, 'request', tweetClass, '3'],
          );
        } catch (error) {
          this.logger.error(`Error inserting tweet/classification ${tweetId}: ${error.message}`);
        }
      }
    }

    this.logger.log(`Dataset2 insertion completed.`);
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  }
}
