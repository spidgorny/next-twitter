import { NextApiRequest, NextApiResponse } from "next";
import jwt from "next-auth/jwt";

const Twitter = require("twitter-lite");

if (!process.env.TWITTER_KEY) {
	throw new Error("TWITTER_KEY undefined");
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	// @ts-ignore
	const token = await jwt.getToken({ req, secret: process.env.SECRET });

	const client = new Twitter({
		consumer_key: process.env.TWITTER_KEY,
		consumer_secret: process.env.TWITTER_SECRET,
		access_token_key: token.oauth_token,
		access_token_secret: token.oauth_token_secret,
	});

	const debug = process.env.NODE_ENV === "development";

	try {
		if (!token?.id) {
			throw new Error("not logged-in");
		}
		const result = await client.get(`lists/list`);
		res.setHeader("cache-control", "public, maxage=3600");
		console.log(result);
		if (result.text) {
			res.status(500).json({ error: result.text, headers: result.headers });
			return;
		}
		res.status(200).json({
			status: "ok",
			lists: result ?? [],
		});
	} catch (e) {
		const error = e as Error;
		res
			.status(500)
			.json({ error: error.message, stack: error.stack?.split("\n") });
	}
};
