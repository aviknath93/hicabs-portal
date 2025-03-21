import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn()
  profileId: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  profileImageUrl: string;

  @Column({ nullable: true })
  contactCountryCode: number;

  @Column({ nullable: true, unique: true })
  contact: number;

  @Column({ nullable: true })
  contactVerificationOtp: number;

  @Column({ nullable: true })
  contactVerificationOtpExpireDatetime: Date;

  @Column({ default: false })
  contactVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
