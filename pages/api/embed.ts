// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getSession } from "next-auth/client";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "next-auth/jwt";
import axios from "axios";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const tweetLink = req.query.tweetLink as string;
	const url = new URL("https://publish.twitter.com/oembed");
	url.searchParams.set("url", tweetLink);
	const result = await axios.get(url.toString());
	res.status(200).json(result.data);
};
