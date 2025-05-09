import { config as dotenvConfig } from 'dotenv'; 

dotenvConfig({ path: '.env' });

export const env = {
  port: process.env.PORT,
  secretKey: process.env.JWT_SECRET,
  database: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  },
  twitter: {
    clientId: process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.TWITTER_CLIENT_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_TOKEN_SECRET,
    bearerToken: process.env.TWITTER_BEARER_TOKEN,
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
  },
};