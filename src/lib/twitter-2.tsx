import { Client } from "twitter-api-sdk";

const token = process.env.TWITTER_BEARER_TOKEN || "";

const client = new Client(token);

export const getTweet = async (id: string) => {
  const tweet = await (
    await client.tweets.findTweetById("1508607411967434757")
  ).data;
  return tweet;
};
