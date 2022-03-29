import { getTweets } from "@/lib/twitter";
import { getTweet } from "@/lib/twitter-2";
import type { NextApiRequest, NextApiResponse } from "next";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  const tweets = await getTweets([id.toString()]);

  res.status(200).json(tweets);
};
