import { NextApiRequest, NextApiResponse } from "next";
import jwt from "next-auth/jwt";

const Twitter = require("twitter-v2");

if (!process.env.TWITTER_KEY) {
	throw new Error("TWITTER_KEY undefined");
}

const client = new Twitter({
	consumer_key: process.env.TWITTER_KEY,
	consumer_secret: process.env.TWITTER_SECRET,
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const token = await jwt.getToken({ req, secret: process.env.SECRET });

	const { data } = await client.get(`users/${token.id}/following`, {});
	console.log(data);
	res.status(200).json(data);
};
