import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Apartment } from 'src/entities/apartment.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateApartmentDto } from './dtos/create-apartment.dto';

@Injectable()
export class ApartmentService {
  constructor(
    @InjectRepository(Apartment)
    private readonly apartmentRepo: Repository<Apartment>,
  ) {}

  async createApartment(dto: CreateApartmentDto, user: User) {
    try {
      if (user.type !== 'landlord')
        throw new HttpException(
          `Only landlords can create apartments, please update your profile!`,
          HttpStatus.FORBIDDEN,
        );

      const newApartment = await this.apartmentRepo.save({
        ...dto,
        landLord: user,
      });

      if (!newApartment) {
        throw new HttpException(
          'Apartment not created',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      delete newApartment.landLord.password;

      return newApartment;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllApartments() {
    try {
      const apartments = await this.apartmentRepo.find();
      console.log(apartments);

      if (apartments.length == 0) {
        throw new HttpException(
          'There are no apartments to show',
          HttpStatus.NO_CONTENT,
        );
      }
      return apartments;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getSingleApartment(apartmentId: string) {
    try {
      const apartmentExists = await this.apartmentRepo.findOne({
        where: { id: apartmentId },
      });

      if (!apartmentExists) {
        throw new HttpException(
          'Apartment does not exist',
          HttpStatus.NOT_FOUND,
        );
      }
      return apartmentExists;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeApartment(apartmentId: string, user: User) {
    try {
      const apartment = await this.apartmentRepo.findOne({
        where: { id: apartmentId },
      });

      if (!apartment) {
        throw new HttpException(
          'apartment does not exist',
          HttpStatus.NOT_FOUND,
        );
      }

      console.log(apartment);

      if (apartment.landLordId !== user.id) {
        throw new HttpException(
          'you cannot delete an apartment you do not own',
          HttpStatus.FORBIDDEN,
        );
      }

      if (apartment && apartment.landLordId === user.id) {
        const apartmentDeleted = this.apartmentRepo.delete(apartmentId);
        if (!apartmentDeleted) {
          throw new HttpException(
            'apartment not deleted',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        return { message: 'apartment successfully deleted' };
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
