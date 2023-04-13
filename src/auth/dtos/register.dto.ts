import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(4)
  firstname: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(4)
  lastname: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(7)
  @Matches(/[A-Z]/, {
    message: 'password must contain at least one capital letter',
  })
  @Matches(/\d/, { message: 'password must contain at least one number' })
  @Matches(/[\W_]/, {
    message: 'password must contain at least one special character',
  })
  password: string;
}
