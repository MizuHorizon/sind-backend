import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './config/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*'
  });
  await app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
  });
}
bootstrap();
