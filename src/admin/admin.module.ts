import { Module } from '@nestjs/common';
import { AdminUserService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUser } from './entities/admin.entity';
import { TwitterModule } from 'src/twitter/twitter.module';
import { TwitterApiService } from 'src/twitter/twitter-api.service';
import { TwitterUser } from 'src/twitter/entities/twitter.entity';
import { News } from 'src/news/entities/news.entity';
import GeminiService from 'src/service/gemini_service';
@Module({
  imports: [TypeOrmModule.forFeature([AdminUser, TwitterUser, News])], 
  controllers: [AdminController],
  providers: [AdminUserService, TwitterApiService, GeminiService],
})
export class AdminModule {}
