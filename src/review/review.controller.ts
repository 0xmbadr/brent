import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/currentUser.decorator';
import { AuthGuardJwt } from 'src/auth/guards/auth-guard.jwt';
import { User } from 'src/entities/user.entity';
import { CreateReviewsDto } from './dtos/create-review.dto';
import { UpdateReviewDto } from './dtos/update-review.dto';
import { ReviewService } from './review.service';

@ApiTags('Reviews')
@Controller('apartments')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(AuthGuardJwt)
  @ApiHeader({ name: 'Authorization' })
  @Post(':apartmentId/reviews')
  create(
    @Param('apartmentId') apartmentId: string,
    @Body() dto: CreateReviewsDto,
    @CurrentUser() user: User,
  ) {
    return this.reviewService.createReview(dto, user, apartmentId);
  }

  @UseGuards(AuthGuardJwt)
  @ApiHeader({ name: 'Authorization' })
  @Patch(':apartmentId/reviews/:reviewId')
  edit(
    @Param('reviewId') reviewId: string,
    @Body() dto: UpdateReviewDto,
    @CurrentUser() user: User,
  ) {
    return this.reviewService.editReview(dto, user, reviewId);
  }

  @UseGuards(AuthGuardJwt)
  @ApiHeader({ name: 'Authorization' })
  @Delete(':apartmentId/reviews/:reviewId')
  delete(@Param('reviewId') reviewId: string, @CurrentUser() user: User) {
    return this.reviewService.deleteReview(user, reviewId);
  }

  @Get(':apartmentId/reviews/:reviewId')
  getOne(@Param('reviewId') reviewId: string) {
    return this.reviewService.getReview(reviewId);
  }

  @Get(':apartmentId/reviews')
  getAll(@Param('apartmentId') apartmentId: string) {
    return this.reviewService.getAllReviews(apartmentId);
  }
}
