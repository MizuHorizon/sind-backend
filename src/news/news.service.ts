import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './entities/news.entity';
import { TwitterApiService } from 'src/twitter/twitter-api.service';
import { TwitterUser, TwitterTweet } from 'src/twitter/entities/twitter.entity';
import GeminiService from '../service/gemini_service';
@Injectable()
export class NewsService {

  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
    @InjectRepository(TwitterUser)
    private twitterUserRepository: Repository<TwitterUser>,
    private twitterApiService: TwitterApiService,
    @InjectRepository(TwitterTweet)
    private twitterTweetRepository: Repository<TwitterTweet>,

    private geminiService: GeminiService,

  ) { }


  async getNews() {
    return this.newsRepository.find();
  }

  async getTwitterSummary(hours: number = 24) {
    try {
      const twitterUsers = await this.twitterUserRepository.find();
      const tweets = [];

      const now = new Date();
      const pastDate = new Date(now.getTime() - hours * 60 * 60 * 1000);

      for (const user of twitterUsers) {
        let userData = [];
        let attempts = 0;
        const maxAttempts = 5;

        while (attempts < maxAttempts) {
          try {
            userData = await this.twitterApiService.getUserTweets(user);
            await this.twitterTweetRepository.insert(userData);
            break; // Exit loop if successful
          } catch (error) {
            console.log('Error fetching tweets from Twitter API:', error);
            // Fetch the most recent tweets from the database
            userData = await this.twitterTweetRepository.find({
              order: { createdAt: 'DESC' }, // Assuming createdAt is a field in your TwitterTweet entity
              take: 10, // Fetch the latest 10 tweets
            });
          }
          attempts++;
        }

        const recentTweets = userData.filter(tweet => new Date(tweet.createdAt) >= pastDate);
        tweets.push(...recentTweets);
      }

      // Generate AI summary for the aggregated tweets
      const summary = await this.generateAISummary(tweets);

      return summary;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch Twitter summary: ' + error.message);
    }
  }

  // Pseudo-function for AI summary generation
  private async generateAISummary(tweets: any[]): Promise<string> {
    // Implement your AI summary generation logic here
    // For example, you could use a language model to summarize the content of the tweets
    try {
      const prompt = `
      Summarize the following tweets:
      ${tweets.map(tweet => `${tweet.displayName} - ${tweet.username}: ${tweet.text}`).join('\n')}
      `;
      const summary = await this.geminiService.generateContent(prompt);
      return summary.candidates[0].content;
    } catch (error) {
      console.log("error", error);
      throw new InternalServerErrorException('Failed to generate AI summary: ' + error.message);
    }
  }
  async getTwitterFeed(page: number = 1, limit: number = 10) {
    try {
      // Fetch all Twitter users from the database
      const twitterUsers = await this.twitterUserRepository.find();
      const twitterFeed = [];

      for (const user of twitterUsers) {
        let userData = [];
        try {
          userData = await this.twitterApiService.getUserTweets(user);
          await this.twitterTweetRepository.insert(userData);
          // Exit loop if successful
        } catch (error) {
          console.log('Error fetching tweets from Twitter API:', error);
          // Fetch the most recent tweets from the database
          userData = await this.twitterTweetRepository.find({
            order: { createdAt: 'DESC' }, // Assuming createdAt is a field in your TwitterTweet entity
            take: limit, // Fetch the latest 10 tweets
          });
        }

        twitterFeed.push(...userData);
      }


      // Shuffle the tweets to simulate randomness
      const shuffledFeed = twitterFeed.sort(() => Math.random() - 0.5);

      // Calculate the starting index for pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      // Return the paginated feed data
      return shuffledFeed.slice(startIndex, endIndex);
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch Twitter feed: ' + error);
    }
  }


  create(createNewsDto: CreateNewsDto) {
    return 'This action adds a new news';
  }

  findAll() {
    return `This action returns all news`;
  }

  findOne(id: number) {
    return `This action returns a #${id} news`;
  }

  update(id: number, updateNewsDto: UpdateNewsDto) {
    return `This action updates a #${id} news`;
  }

  remove(id: number) {
    return `This action removes a #${id} news`;
  }
}
function Tweets(): any {
  throw new Error('Function not implemented.');
}

