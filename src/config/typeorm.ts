import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

const config = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  saltkey: process.env.SALT_KEY,
  saltRounds:process.env.SALT_ROUNDS,
  // entities: entities,
  entities: [
    join(__dirname,'/../**/*.entity{.ts,.js}'),
  ],
  //entities: ['dist/app.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  synchronize: true,
  autoLoadEntities: true,
  ssl: process.env.SSL_MODE === 'true' ? { rejectUnauthorized: false } : undefined
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
