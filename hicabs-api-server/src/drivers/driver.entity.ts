import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  Title: string | null;

  @Column({ type: 'varchar', length: 20 })
  fName: string;

  @Column({ type: 'varchar', length: 20 })
  lName: string;

  @Column({ type: 'text' })
  id_card_details: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  Telephone: string | null;

  @Column({ type: 'varchar', length: 50 })
  Mobile: string;

  @Column({ type: 'varchar', length: 10 })
  MobileCode: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  Landline: string | null;

  @Column({ type: 'varchar', length: 250 })
  Address: string;

  @Column({ type: 'varchar', length: 10, default: 'User' })
  Type: string;

  @Column({ type: 'varchar', length: 10 })
  Level: string;

  @Column({ type: 'varchar', length: 55, nullable: true })
  mylat: string | null;

  @Column({ type: 'varchar', length: 55, nullable: true })
  mylong: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  creationDate: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  modificationDate: Date | null;

  @Column({ type: 'tinyint', width: 1, default: () => 0 })
  delete_flag: boolean;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 20 })
  uName: string;

  @Column({ type: 'varchar', length: 50 })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  resettoken: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tokenexpmctime: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  token_id: string | null;

  @Column({ type: 'varchar', length: 4, nullable: true })
  pwdOTP: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  pwdOTPexptime: string | null;

  @Column({ type: 'int', default: () => 0 })
  driver_type: number;

  @Column({
    type: 'varchar',
    length: 11,
    default: '1.0',
    comment: 'Driver APP Version number',
  })
  version: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  modDateTime: Date;

  @Column({ type: 'varchar', length: 36, nullable: true })
  vendor_id: string | null;
}
