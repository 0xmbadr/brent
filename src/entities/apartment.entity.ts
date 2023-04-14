import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('apartments')
export class Apartment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  address: string;

  @Column('text', { array: true })
  imagesLink: string[];

  @Column('text')
  details: string;

  @Column({ default: false })
  isApartmentVerified: boolean;

  @ManyToOne(() => User, (user) => user.apartments)
  @JoinColumn({ name: 'landLordId' })
  landLord: User;

  @Column()
  landLordId: string;

  @CreateDateColumn()
  createdAt: Date;
}
