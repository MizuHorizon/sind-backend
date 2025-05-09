import { Module } from '@nestjs/common';
import { AdminUserService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUser } from './entities/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdminUser])], 
  controllers: [AdminController],
  providers: [AdminUserService],
})
export class AdminModule {}
