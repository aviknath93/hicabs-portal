import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  sessionId: string;

  @Column()
  userId: string;

  @Column()
  ipAddress: string;

  @Column()
  userAgent: string;

  @Column()
  token: string;
}
