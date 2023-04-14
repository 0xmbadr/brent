import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dtos/register.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
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

      // generate Token
      const payload = {
        sub: newUser.id,
        email: newUser.email,
      };
      const token = this.jwtService.sign(payload);

      return { newUser, token };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login({ email, password }: LoginDto) {
    try {
      // check if user exists
      const user: User = await this.userRepo.findOne({ where: { email } });

      if (!user)
        throw new HttpException(
          `You're not registered, please register first!`,
          HttpStatus.FORBIDDEN,
        );
      // check if password is correct
      const passwordMatches = await bcrypt.compare(password, user.password);

      if (!passwordMatches)
        throw new HttpException('incorrect password', HttpStatus.FORBIDDEN);

      // GENERATE TOKEN
      const payload = {
        sub: user.id,
        email,
      };

      const token = this.jwtService.sign(payload);

      // Return User data with token
      delete user.password;

      return { user, token };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
