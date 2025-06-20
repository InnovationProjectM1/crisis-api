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

    this.logger.log(`All SQL files executed successfully.`);
  }
}
