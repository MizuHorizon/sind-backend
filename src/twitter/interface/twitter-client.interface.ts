export interface Tweet {
    id: string;
    text: string;
    authorId: string;
    authorName: string;
    createdAt: Date;
    // Add more properties as needed
  }
  
  // export interface TwitterClientInterface {
  //   getUserTweets(userId: string, count?: number): Promise<Tweet[]>;
  //   getUsersByIds(userIds: string[]): Promise<any[]>;
  // }