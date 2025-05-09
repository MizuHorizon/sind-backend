import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsModule } from './news/news.module';
import { TwitterModule } from './twitter/twitter.module';
import { AdminModule } from './admin/admin.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeorm from './config/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { env } from './config/env';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        // refering this file from config/typeorm.ts
        configService.get('typeorm'),
      inject: [ConfigService],
    }),
    JwtModule.register({  
      global: true,
      secret: env.secretKey,
      signOptions: { expiresIn: '1h' },
    }),
    
    NewsModule, TwitterModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
