import { Module } from '@nestjs/common';
import { TwitterApiService } from './twitter-api.service';
import { TwitterController } from './twitter.controller';
import { TwitterService } from './twitter.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwitterUser } from './entities/twitter.entity';
import { TwitterUserService } from './twitter-user.service';

export const TWITTER_CLIENT = 'TWITTER_CLIENT';

@Module({
  imports: [TypeOrmModule.forFeature([TwitterUser])],
  controllers: [TwitterController],
  providers: [
    TwitterService,
     TwitterUserService,
      TwitterApiService,
    // TwitterApiService,
    // {
    //   provide: TWITTER_CLIENT,
    //   useExisting: TwitterApiService,
    // },
  ],
  exports: [TwitterService, TwitterUserService],
})
export class TwitterModule {}

