import { getThread } from "@/lib/twitter";
import type { NextApiRequest, NextApiResponse } from "next";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  const tweet = await getThread((id || "1504838800391946266").toString());

  res.status(200).json(tweet);
};
