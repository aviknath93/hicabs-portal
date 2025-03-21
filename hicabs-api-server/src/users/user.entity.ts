import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { IsEmail, IsEnum, IsString, IsBoolean } from 'class-validator';
import { Password } from '../passwords/password.entity';
import { Profile } from '../profiles/profile.entity';

export enum UserType {
  ADMIN = 'admin',
  VENDOR = 'vendor',
  DRIVER = 'driver',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column()
  @IsString()
  vendorName: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  emailVerificationOtp: number;

  @Column({ default: false })
  @IsBoolean()
  isEmailVerified: boolean;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.VENDOR,
  })
  @IsEnum(UserType)
  userType: UserType;

  @Column({ default: false })
  @IsBoolean()
  isBlocked: boolean;

  @OneToOne(() => Password, (password) => password.user)
  password: Password;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
