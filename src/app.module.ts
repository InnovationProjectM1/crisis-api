import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TweetModule } from './tweets/tweet.module';
import { ClassifierModule } from './classifier/classifier.module';
import { Tweet } from './tweets/tweet.entity';
import { Classifier } from './classifier/classifier.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: parseInt(configService.get('DATABASE_PORT') || '5432'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        schema: configService.get('DATABASE_SCHEMA') || 'public',
        entities: [Tweet, Classifier],
        synchronize: false, // Désactivé pour éviter les conflits avec les tables existantes
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    TweetModule,
    ClassifierModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
