import { Inject, Injectable } from '@nestjs/common';
import { Tweet } from './interface/twitter-client.interface';
import { TwitterApiService } from './twitter-api.service';
@Injectable()
export class TwitterService {
  constructor(
    private readonly twitterClient: TwitterApiService
  ) {
    console.log(this.twitterClient);
  }


  /**
   * Fetch tweets from a list of user IDs
   * @param userIds Array of Twitter user IDs
   * @param tweetsPerUser Number of tweets to fetch per user
   * @returns Array of tweets from all users
   */
  async getTweetsFromUsers(userIds: string[], tweetsPerUser: number = 10): Promise<Tweet[]> {
    try {
      // Fetch tweets for each user in parallel
      const tweetPromises = userIds.map(userId => 
        this.twitterClient.getUserTweets(userId, tweetsPerUser)
      );
      
      const userTweets = await Promise.all(tweetPromises);
      
      // Flatten the array of tweet arrays
      return userTweets.flat();
    } catch (error) {
      throw new Error(`Failed to fetch tweets from users: ${error.message}`);
    }
  }

  /**
   * Get user details for a list of user IDs
   * @param userIds Array of Twitter user IDs
   * @returns User information
   */
  async getUsersInfo(userIds: string[]): Promise<any[]> {
    return await this.twitterClient.getUsersByIds(userIds);
  }

  /**
   * Sort tweets by date (newest first)
   * @param tweets Array of tweets
   * @returns Sorted array of tweets
   */
  sortTweetsByDate(tweets: Tweet[]): Tweet[] {
    return [...tweets].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Filter tweets by keyword
   * @param tweets Array of tweets
   * @param keyword Keyword to filter by
   * @returns Filtered array of tweets
   */
  filterTweetsByKeyword(tweets: Tweet[], keyword: string): Tweet[] {
    const lowercaseKeyword = keyword.toLowerCase();
    return tweets.filter(tweet => 
      tweet.text.toLowerCase().includes(lowercaseKeyword)
    );
  }
}