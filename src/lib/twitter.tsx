import { TweetV2, TwitterApi } from "twitter-api-v2";

export const getTweets = async (id: string) => {
  if (id.length === 0) {
    return {};
  }

  const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN || "");

  const tweet = await twitterClient.v2.singleTweet(id, {
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
  });

  const getAuthorInfo = (author_id: TweetV2["author_id"]) => {
    return tweet.includes?.users?.find((user) => user.id === author_id);
  };

  return {
    ...tweet.data,
    author: getAuthorInfo(tweet.data.author_id),
  };
};
