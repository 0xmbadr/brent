import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Apartment } from './apartment.entity';
import { User } from './user.entity';

@Unique(['reviewerId', 'apartmentId'])
@Entity({ name: 'reviews' })
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  apartmentReview: string;

  @Column({ nullable: true })
  environmentReview: string;

  @Column({ nullable: true })
  amenitiesReview: string;

  @Column({ nullable: true })
  landlordReview: string;

  @ManyToOne(() => Apartment, (apartment) => apartment.reviews)
  @JoinColumn({ name: 'apartmentId' })
  apartment: Apartment;

  @Column()
  apartmentId: string;

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'reviewerId' })
  reviewer: User;

  @Column({ nullable: false })
  reviewerId: string;

  @CreateDateColumn()
  createdAt: Date;
}
