import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateApartmentDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsArray()
  imagesLink: string[];

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  details: string;
}
