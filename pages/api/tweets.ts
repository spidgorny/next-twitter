import { NextApiRequest, NextApiResponse } from "next";
import jwt from "next-auth/jwt";

const Twitter = require("twitter-v2");

if (!process.env.TWITTER_KEY) {
	throw new Error("TWITTER_KEY undefined");
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const user = req.query.user;
	let endpoint = `users/${user}/tweets`;
	console.log(endpoint);
	try {
		// @ts-ignore
		const token = await jwt.getToken({ req, secret: process.env.SECRET });
		const client = new Twitter({
			consumer_key: process.env.TWITTER_KEY,
			consumer_secret: process.env.TWITTER_SECRET,
			access_token_key: token?.oauth_token,
			access_token_secret: token?.oauth_token_secret,
		});
		let parameters: object = {
			exclude: "retweets,replies",
			max_results: 5,
			expansions:
				"attachments.media_keys,referenced_tweets.id,referenced_tweets.id.author_id",
			"media.fields": "media_key,preview_image_url,url",
			"tweet.fields": "attachments,referenced_tweets,entities",
		};
		if (req.query?.since) {
			parameters = { ...parameters, start_time: req.query?.since };
		}
		const { data } = await client.get(endpoint, parameters);
		// console.log(data);
		res.status(200).json(data);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
};
