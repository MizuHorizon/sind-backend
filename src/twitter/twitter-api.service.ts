import { Injectable } from '@nestjs/common';
import { Tweet } from './interface/twitter-client.interface';
import { env } from '../config/env';
import * as TwitterApi from 'twitter-api-v2';
import { TwitterUser } from './entities/twitter.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TwitterApiService {
  private twitterClient: TwitterApi.TwitterApi;

  constructor(
    @InjectRepository(TwitterUser)
    private twitterUserRepository: Repository<TwitterUser>,
  ) {
    // this.twitterClient = new TwitterApi.TwitterApi({
    //   clientId: env.twitter.clientId,
    //   clientSecret: env.twitter.clientSecret,
    //   // accessToken: env.twitter.accessToken,
    //   // accessTokenSecret: env.twitter.accessTokenSecret,
    // });

    this.twitterClient = new TwitterApi.TwitterApi(env.twitter.bearerToken);
  }

  async getUserTweets(user: TwitterUser, count: number = 10): Promise<Tweet[]> {
    try {
      const response = await this.twitterClient.v2.userTimeline(user.twitterId, {
        max_results: count,
        'tweet.fields': ['created_at', 'author_id'],
        expansions: ['author_id'],
        'user.fields': ['name', 'username', 'profile_image_url']
      });
      console.log("response", response);

      return this.formatTweets(response,user);
    } catch (error) {
      console.log(error);
      throw new Error(`Failed to fetch tweets: ${error.message}`);
    }
  }

  async getUserByUsername(username: string): Promise<any> {
    try {
      const response = await this.twitterClient.v2.userByUsername(username, {
        'user.fields': ['name', 'username', 'profile_image_url', 'description']
      });
      console.log("response fetching username",response);
      if(response.errors && response.errors?.length > 0){
        throw new Error("User not found");
      }
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  }

  async getUsersByIds(userIds: string[]): Promise<any[]> {
    try {
      const response = await this.twitterClient.v2.users(userIds, {
        'user.fields': ['name', 'username', 'profile_image_url', 'description']
      });
      console.log(response);
      return response.data || [];
    } catch (error) {
      console.log(error);
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  private formatTweets(response: any,user:TwitterUser): Tweet[] {
    const includes = response.includes || { users: [] };
    const users = new Map(
      (includes.users || []).map(user => [user.id, user])
    );
    console.log("response.data", response.data.data );

    if (!Array.isArray(response.data.data)) {
      console.error('Unexpected response format:', response);
      return [];
    }

    return response.data.data.map((tweet:any) => ({
      id: tweet.id,
      text: tweet.text,
      authorId: tweet.author_id,
      authorName: user.displayName,
      authorUsername: user.username,
      authorProfileImageUrl: user.profileImageUrl,
      createdAt: new Date(tweet.created_at),
    }));
  }
}