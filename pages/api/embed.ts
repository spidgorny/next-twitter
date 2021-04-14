// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const tweetLink = req.query.tweetLink as string;
	const url = new URL("https://publish.twitter.com/oembed");
	url.searchParams.set("url", tweetLink);
	const result = await axios.get(url.toString());
	res.status(200).json(result.data);
};
