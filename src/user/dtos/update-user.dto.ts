import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { UserType } from 'src/entities/user.entity';

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  firstname: string;

  @ApiProperty()
  @IsOptional()
  lastname: string;

  @ApiProperty()
  @IsOptional()
  type: UserType;
}
