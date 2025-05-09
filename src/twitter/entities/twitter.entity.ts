import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('twitter_users')
export class TwitterUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  displayName: string;

  @Column({ nullable: true })
  profileImageUrl: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  twitterId: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}