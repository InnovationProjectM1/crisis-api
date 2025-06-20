import { PartialType } from '@nestjs/mapped-types';
import { CreateClassifierDto } from './create-classifier.dto';

export class UpdateClassifierDto extends PartialType(CreateClassifierDto) {}
