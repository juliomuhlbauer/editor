import { MediaObjectV2 } from "twitter-api-v2";

export type Theme = "light" | "darkBlue" | "dark";

export type Format = "twitter" | "instagram" | "1x1";

export type TweetProps = {
  authorHandle: string;
  text: string;
  avatarUrl: string;
  authorName: string;
  media: (MediaObjectV2 | undefined)[];
};
