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

@Entity('passwords')
export class Password {
  @PrimaryGeneratedColumn()
  passwordId: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  hashedPassword: string;

  @Column({ nullable: true })
  forgotPasswordOtp: number;

  @Column({ nullable: true })
  forgotPasswordOtpExpireDatetime: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
