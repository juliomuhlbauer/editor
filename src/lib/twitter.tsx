import { TweetV2, TwitterApi } from "twitter-api-v2";

export const getTweet = async (id: string) => {
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
    media:
      tweet.data.attachments?.media_keys?.map((key: any) =>
        tweet.includes?.media?.find((media: any) => media.media_key === key)
      ) || [],
  };
};

export const getTweets = async (ids: string[]) => {
  const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN || "");

  const tweets = await twitterClient.v2.tweets(ids, {
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
    return tweets.includes?.users?.find((user) => user.id === author_id);
  };

  return tweets.data.map((tweet) => ({
    ...tweet,
    author: getAuthorInfo(tweet.author_id),
    media:
      tweet.attachments?.media_keys?.map((key: any) =>
        tweets.includes?.media?.find((media: any) => media.media_key === key)
      ) || [],
  }));
};

export const getThread = async (id: string) => {
  const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN || "");

  const tweet = await getTweet(id);

  const author = tweet.author?.username;

  const thread = await twitterClient.v2.search(
    `from:${author} to:${author} conversation_id:${id}`,
    {
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
    }
  );

  while (!thread.done) {
    await thread.fetchNext();
  }

  return {
    tweets: [
      tweet,
      ...thread.tweets.reverse().map((tweet) => ({
        ...tweet,
        media:
          tweet.attachments?.media_keys?.map((key: any) =>
            thread.includes?.media?.find(
              (media: any) => media.media_key === key
            )
          ) || [],
      })),
    ],
    author: tweet.author,
  };
};
