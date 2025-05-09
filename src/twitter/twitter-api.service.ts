import { Injectable } from '@nestjs/common';
import { Tweet } from './interface/twitter-client.interface';
import { env } from '../config/env';
import * as TwitterApi from 'twitter-api-v2';

@Injectable()
export class TwitterApiService {
  private twitterClient: TwitterApi.TwitterApi;
  
  constructor() {
      this.twitterClient = new TwitterApi.TwitterApi({
        clientId: env.twitter.clientId,
        clientSecret: env.twitter.clientSecret,
      });
  }

  async getUserTweets(userId: string, count: number = 10): Promise<Tweet[]> {
    try {
      const response = await this.twitterClient.v2.userTimeline(userId, {
        max_results: count,
        'tweet.fields': ['created_at', 'author_id'],
        expansions: ['author_id'],
        'user.fields': ['name', 'username']
      });

      return this.formatTweets(response);
    } catch (error) {
      throw new Error(`Failed to fetch tweets: ${error.message}`);
    }
  }

  async getUsersByIds(userIds: string[]): Promise<any[]> {
    try {
      const response = await this.twitterClient.v2.users(userIds, {
        'user.fields': ['name', 'username', 'profile_image_url', 'description']
      });
      
      return response.data || [];
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  private formatTweets(response: any): Tweet[] {
    const includes = response.includes || { users: [] };
    const users = new Map(
      (includes.users || []).map(user => [user.id, user])
    );

    return (response.data || []).map(tweet => ({
      id: tweet.id,
      text: tweet.text,
      authorId: tweet.author_id,
      authorName: (users.get(tweet.author_id) as { name: string }).name || 'Unknown',
      createdAt: new Date(tweet.created_at),
    }));
  }
}