import { NextApiRequest, NextApiResponse } from "next";
import jwt from "next-auth/jwt";

const Twitter = require("twitter-v2");

if (!process.env.TWITTER_KEY) {
	throw new Error("TWITTER_KEY undefined");
}

// const client = new Twitter({
// 	consumer_key: process.env.TWITTER_KEY,
// 	consumer_secret: process.env.TWITTER_SECRET,
// });

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

	// res.status(500).json({ error: "Trigger error" });
	// return;

	try {
		if (!token?.id) {
			throw new Error("not logged-in");
		}
		let parameters: any = {
			max_results: debug ? 10 : 50,
			"user.fields": "profile_image_url",
		};
		let nextToken = req.query.nextToken;
		if (nextToken) {
			parameters.pagination_token = nextToken;
		}
		const result = await client.get(`users/${token.id}/following`, parameters);
		res.setHeader("cache-control", "public, maxage=3600");
		console.log(result);
		if (result.text) {
			res.status(500).json({ error: result.text, headers: result.headers });
			return;
		}
		res.status(200).json({
			status: "ok",
			data: result.data?.data,
			meta: result.data?.meta,
			headers: result.headers,
		});
	} catch (e) {
		const error = e as Error;
		res.status(500).json({ error: error.message, stack: error.stack });
	}
};
