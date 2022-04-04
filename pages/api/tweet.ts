import { getTweet } from "@/lib/twitter";
import type { NextApiRequest, NextApiResponse } from "next";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  const tweet = await getTweet((id || "1508213556474482702").toString());

  res.status(200).json(tweet);
};
