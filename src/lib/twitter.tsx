import { TweetProps } from "@/types";
import {
  TweetSearchRecentV2Paginator,
  TweetV2,
  Tweetv2FieldsParams,
  TweetV2LookupResult,
  TweetV2SingleResult,
  TwitterApi,
} from "twitter-api-v2";

const tweetParams: Partial<Tweetv2FieldsParams> = {
  expansions: [
    "author_id",
    "attachments.media_keys",
    "referenced_tweets.id",
    "referenced_tweets.id.author_id",
  ],
  "tweet.fields": [
    "attachments",
    "author_id",
    "public_metrics",
    "created_at",
    "id",
    "in_reply_to_user_id",
    "referenced_tweets",
    "text",
  ],
  "user.fields": [
    "id",
    "name",
    "profile_image_url",
    "protected",
    "url",
    "username",
    "verified",
  ],
  "media.fields": [
    "duration_ms",
    "height",
    "media_key",
    "preview_image_url",
    "type",
    "url",
    "width",
    "public_metrics",
  ],
};

const getAuthor = (
  tweet: TweetV2SingleResult | TweetV2LookupResult,
  author_id: TweetV2["author_id"]
): TweetProps["author"] => {
  const author = tweet.includes?.users?.find((user) => user.id === author_id);

  return {
    name: author?.name || "",
    username: author?.username || "",
    avatarUrl: author?.profile_image_url || "",
    verified: author?.verified || false,
  };
};

const getMedia = (tweet: TweetV2SingleResult): TweetProps["media"] => {
  return (
    tweet.data.attachments?.media_keys?.map((key: any) =>
      tweet.includes?.media?.find((media: any) => media.media_key === key)
    ) || []
  );
};

const getMediaofTweets = (
  tweets: TweetV2LookupResult | TweetSearchRecentV2Paginator,
  tweet: TweetV2
): TweetProps["media"] => {
  return (
    tweet.attachments?.media_keys?.map((key: any) =>
      tweets.includes?.media?.find((media: any) => media.media_key === key)
    ) || []
  );
};

const tweetFormatter = (tweet: TweetV2SingleResult): TweetProps => {
  const author = getAuthor(tweet, tweet.data.author_id);
  const media = getMedia(tweet);

  return {
    text: tweet.data.text,
    author,
    media,
  };
};

const tweetsFormatter = (tweets: TweetV2LookupResult): TweetProps[] => {
  return tweets.data.map((tweet) => {
    return {
      text: tweet.text,
      author: getAuthor(tweets, tweet.author_id),
      media: getMediaofTweets(tweets, tweet),
    };
  });
};

export const getTweet = async (id: string): Promise<TweetProps> => {
  const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN || "");

  const tweet = await twitterClient.v2.singleTweet(id, tweetParams);

  return tweetFormatter(tweet);
};

export const getTweets = async (ids: string[]): Promise<TweetProps[]> => {
  const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN || "");

  const tweets = await twitterClient.v2.tweets(ids, tweetParams);

  return tweetsFormatter(tweets);
};

export const getThread = async (id: string): Promise<TweetProps[]> => {
  const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN || "");

  const firstTweet = await getTweet(id);

  const authorHandle = firstTweet.author.username;

  const query = `from:${authorHandle} to:${authorHandle} conversation_id:${id}`;

  const thread = await twitterClient.v2.search(query, tweetParams);

  while (!thread.done) {
    await thread.fetchNext();
  }

  const formattedThread: TweetProps[] = thread.tweets
    .reverse()
    .map((tweet) => ({
      text: tweet.text,
      author: firstTweet.author,
      media: getMediaofTweets(thread, tweet),
    }));

  const tweets = [firstTweet, ...formattedThread];

  return tweets;
};
