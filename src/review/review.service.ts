import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Apartment } from 'src/entities/apartment.entity';
import { Review } from 'src/entities/review.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateReviewsDto } from './dtos/create-review.dto';
import { UpdateReviewDto } from './dtos/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
    @InjectRepository(Apartment)
    private readonly apartmentRepo: Repository<Apartment>,
  ) {}

  async createReview(dto: CreateReviewsDto, user: User, apartmentId: string) {
    try {
      const apartment = await this.apartmentRepo.findOne({
        where: {
          id: apartmentId,
        },
      });

      if (!apartment) {
        throw new HttpException(
          'Apartment does not exist',
          HttpStatus.NOT_FOUND,
        );
      }

      // landlord can't review
      if (apartment.landLordId === user.id) {
        throw new HttpException(
          'owner cannot review his/her own apartment',
          HttpStatus.UNAUTHORIZED,
        );
      }

      //save apartment
      const createdReview = await this.reviewRepo.save({
        ...dto,
        reviewerId: user.id,
        apartmentId,
      });

      if (!createdReview) {
        throw new HttpException(
          'Review not saved',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return createdReview;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async editReview(dto: UpdateReviewDto, user: User, reviewId: string) {
    try {
      //check if review exists
      const review = await this.reviewRepo.findOne({
        where: { id: reviewId },
      });

      if (!review) {
        throw new HttpException('Review does not exist', HttpStatus.NOT_FOUND);
      }
      if (review.reviewerId !== user.id) {
        throw new UnauthorizedException();
      }
      //update review
      const updatedReview = await this.reviewRepo.update(reviewId, dto);
      if (!updatedReview) {
        throw new HttpException(
          'Review not updated',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return { message: 'Review updated' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteReview(user: User, reviewId: string) {
    try {
      const review = await this.reviewRepo.findOne({ where: { id: reviewId } });

      //ensure only revewer can delete reviews
      if (review.reviewerId !== user.id) {
        throw new HttpException(
          'You cannot delete a review you did not write',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const reviewDeleted = await this.reviewRepo.delete(reviewId);

      if (!reviewDeleted) {
        throw new HttpException(
          'Review not deleted',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return { message: 'Review deleted' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getReview(reviewId: string) {
    try {
      const review = await this.reviewRepo.findOne({ where: { id: reviewId } });

      if (!review) throw new NotFoundException();

      return review;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllReviews(apartmentId: string) {
    try {
      const reviews = await this.reviewRepo
        .createQueryBuilder('reviews')
        .innerJoin('reviews.apartment', 'apartments')
        .where('apartments.id = :apartmentId', { apartmentId })
        .getMany();

      if (reviews.length == 0) {
        throw new HttpException(
          'There are no reviews to show',
          HttpStatus.NO_CONTENT,
        );
      }

      return reviews;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
