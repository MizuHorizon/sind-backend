import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

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


@Entity('twitter_tweets')
export class TwitterTweet {
  @PrimaryGeneratedColumn('uuid')
  tweetId: string;

  @Column({ nullable: true })
  id: string;

  @Column({ nullable: true })
  displayName: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  profile_image_url: string;

  @Column({ nullable: true })
  text: string;

  @Column({ nullable: true })
  created_at: string;

  @CreateDateColumn()
  createdAt: Date;
}