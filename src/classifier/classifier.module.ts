import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassifierService } from './classifier.service';
import { ClassifierController } from './classifier.controller';
import { Classifier } from './classifier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Classifier])],
  controllers: [ClassifierController],
  providers: [ClassifierService],
  exports: [ClassifierService],
})
export class ClassifierModule {}
