import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from './entities/news.entity';
import { TwitterApiService } from 'src/twitter/twitter-api.service';
import { TwitterUser } from 'src/twitter/entities/twitter.entity';
@Module({
  controllers: [NewsController],
  providers: [NewsService, TwitterApiService],
  imports: [TypeOrmModule.forFeature([News, TwitterUser])],
})
export class NewsModule {}
