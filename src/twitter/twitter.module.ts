import { Module } from '@nestjs/common';
import { TwitterService } from './twitter-api.service';
import { TwitterController } from './twitter.controller';

@Module({
  controllers: [TwitterController],
  providers: [TwitterService],
})
export class TwitterModule {}
