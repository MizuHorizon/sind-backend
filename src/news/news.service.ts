import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './entities/news.entity';
import { TwitterApiService } from 'src/twitter/twitter-api.service';
import { TwitterUser } from 'src/twitter/entities/twitter.entity';
@Injectable()
export class NewsService {

  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
    @InjectRepository(TwitterUser)
    private twitterUserRepository: Repository<TwitterUser>,
    private twitterApiService: TwitterApiService,
  ) { }

  async getTwitterSummary(hours: number = 24) {
    try {
      const twitterUsers = await this.twitterUserRepository.find();
      const tweets = [];

      const now = new Date();
      const pastDate = new Date(now.getTime() - hours * 60 * 60 * 1000);

      for (const user of twitterUsers) {
        const userData = await this.twitterApiService.getUserTweets(user);
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
    return "AI-generated summary of the last " + tweets.length + " tweets.";
  }
  async getTwitterFeed(page: number = 1, limit: number = 10) {
    try {
      // Fetch all Twitter users from the database
      const twitterUsers = await this.twitterUserRepository.find();
      const twitterFeed = [];

      // Fetch data for each Twitter user
      for (const user of twitterUsers) {
        const userData = await this.twitterApiService.getUserTweets(user as any, limit);
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
      throw new InternalServerErrorException('Failed to fetch Twitter feed: ' + error.message);
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

