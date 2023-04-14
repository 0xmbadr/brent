import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Apartment } from 'src/entities/apartment.entity';
import { Review } from 'src/entities/review.entity';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Apartment])],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
