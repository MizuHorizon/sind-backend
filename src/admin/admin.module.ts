import { Module } from '@nestjs/common';
import { AdminUserService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUser } from './entities/admin.entity';
import { TwitterModule } from 'src/twitter/twitter.module';
import { TwitterApiService } from 'src/twitter/twitter-api.service';
import { TwitterUser } from 'src/twitter/entities/twitter.entity';
@Module({
  imports: [TypeOrmModule.forFeature([AdminUser, TwitterUser])], 
  controllers: [AdminController],
  providers: [AdminUserService, TwitterApiService],
})
export class AdminModule {}
