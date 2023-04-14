import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewsDto } from './create-review.dto';

export class UpdateReviewDto extends PartialType(CreateReviewsDto) {}
