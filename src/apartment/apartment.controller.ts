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
import { ApartmentService } from './apartment.service';
import { CreateApartmentDto } from './dtos/create-apartment.dto';
import { UpdateApartmentDto } from './dtos/update-apartment.dto';

@ApiTags('Apartment')
@Controller('apartment')
export class ApartmentController {
  constructor(private readonly apartmentService: ApartmentService) {}

  @UseGuards(AuthGuardJwt)
  @ApiHeader({ name: 'Authorization' })
  @Post()
  create(@Body() dto: CreateApartmentDto, @CurrentUser() user: User) {
    return this.apartmentService.createApartment(dto, user);
  }

  @Get()
  getAll() {
    return this.apartmentService.getAllApartments();
  }

  @Get(':apartmentId')
  getOne(@Param('apartmentId') apartmentId: string) {
    return this.apartmentService.getSingleApartment(apartmentId);
  }

  @UseGuards(AuthGuardJwt)
  @ApiHeader({ name: 'Authorization' })
  @Delete(':apartmentId')
  remove(@Param('apartmentId') apartmentId: string, @CurrentUser() user: User) {
    return this.apartmentService.removeApartment(apartmentId, user);
  }

  @UseGuards(AuthGuardJwt)
  @ApiHeader({ name: 'Authorization' })
  @Patch(':apartmentId')
  update(
    @Param('apartmentId') apartmentId: string,
    @CurrentUser() user: User,
    @Body() dto: UpdateApartmentDto,
  ) {
    return this.apartmentService.updateApartment(apartmentId, user, dto);
  }
}
