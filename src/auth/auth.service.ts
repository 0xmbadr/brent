import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dtos/register.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async register({ email, password, firstname, lastname }: RegisterDto) {
    try {
      //  Check if user already exists
      const userExists = await this.userRepo.findOne({ where: { email } });
      if (userExists) {
        throw new HttpException('user already exists', HttpStatus.FORBIDDEN);
      }
      // Hash the password
      const salt = bcrypt.genSaltSync(8);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // save user to DB
      const newUser = await this.userRepo.save({
        email,
        password: hashedPassword,
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
