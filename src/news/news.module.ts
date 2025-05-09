import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from './entities/news.entity';
import { TwitterApiService } from 'src/twitter/twitter-api.service';
import { TwitterUser, TwitterTweet } from 'src/twitter/entities/twitter.entity';
import  GeminiService  from '../service/gemini_service';
@Module({
  controllers: [NewsController],
  providers: [NewsService, TwitterApiService, GeminiService],
  imports: [TypeOrmModule.forFeature([News, TwitterUser, TwitterTweet])],
})
export class NewsModule {}
