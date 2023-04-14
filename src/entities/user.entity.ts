import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Apartment } from './apartment.entity';

export enum UserType {
  TENANT = 'tenant',
  LANDLORD = 'landlord',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.TENANT,
  })
  type: UserType;

  @Column()
  password: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @OneToMany(() => Apartment, (apartment) => apartment.landLord)
  apartments: Apartment[];

  @CreateDateColumn()
  createdAt: Date;
}
