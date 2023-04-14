import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Apartment } from './apartment.entity';
import { User } from './user.entity';

@Entity()
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

  @Index(['reviewerId', 'apartmentId'], { unique: true })
  userApartment: [User, Apartment];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreated: Date;
}
