import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dtos/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async register({ email, password, firstname, lastname }: RegisterDto) {
    try {
      //   TODO: Check if user already exists

      // TODO: Hash the password

      // save user to DB
      const newUser = await this.userRepo.save({
        email,
        password,
        firstname,
        lastname,
      });

      // return user without password
      delete newUser.password;
      return newUser;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
