import { MediaObjectV2 } from "twitter-api-v2";

export type Theme = "light" | "darkBlue" | "dark";

export type Format = "twitter" | "instagram" | "1x1";

export type TweetProps = {
  author: {
    name: string;
    username: string;
    avatarUrl: string;
    verified: boolean;
  };
  text: string;
  media: (MediaObjectV2 | undefined)[];
  // quote
  // reply
};
