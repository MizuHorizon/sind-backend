import { config as dotenvConfig } from 'dotenv'; 

dotenvConfig({ path: '.env' });

export const env = {
  port: process.env.PORT,
  database: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  },
  twitter: {
    clientId: process.env.TWITTER_CLIENT_SECRET,
    clientSecret: process.env.TWITTER_CLIENT_SECRET,
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
  },
};