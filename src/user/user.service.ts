import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getUser(userId: string) {
    try {
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user)
        throw new HttpException('No User with this id', HttpStatus.BAD_REQUEST);
      delete user.password;
      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateUserProfile(userId: string, dto: UpdateUserDto) {
    try {
      //try to update user
      const updateduser = await this.userRepo.update({ id: userId }, dto);

      if (!updateduser) {
        throw new HttpException(
          'user not updated',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      //return updated user
      return { message: 'user successfully updated' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
