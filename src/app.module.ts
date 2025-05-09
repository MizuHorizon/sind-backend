import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsModule } from './news/news.module';
import { TwitterModule } from './twitter/twitter.module';

@Module({
  imports: [NewsModule, TwitterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
