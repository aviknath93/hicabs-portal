// src/drivers/driver.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsString, IsBoolean, IsEnum } from 'class-validator';

export enum CarType {
  FIVE_SEATER = '5 seater',
  SEVEN_SEATER = '7 seater',
  // Add more car types as needed
}

@Entity('drivers')
export class Driver {
  @PrimaryGeneratedColumn('uuid')
  driverId: string;

  @Column()
  @IsString()
  vendorId: string;

  @Column()
  @IsString()
  name: string;

  @Column({
    type: 'enum',
    enum: CarType,
  })
  @IsEnum(CarType)
  carType: CarType;

  @Column()
  @IsString()
  carNo: string;

  @Column({ default: false })
  @IsBoolean()
  isBlocked: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
