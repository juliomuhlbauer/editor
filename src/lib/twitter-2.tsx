import { TwitterApi } from "twitter-api-v2";

const token = process.env.TWITTER_BEARER_TOKEN as string;

const twitterClient = new TwitterApi(token);

export const getTweet = async () => {
  const tweet = twitterClient.v2.singleTweet("1508607411967434757");
  return tweet;
};
