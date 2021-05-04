import { NextApiRequest, NextApiResponse } from "next";
import jwt from "next-auth/jwt";

const Twitter = require("twitter-v2");

if (!process.env.TWITTER_KEY) {
	throw new Error("TWITTER_KEY undefined");
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	let endpoint = `tweets/${req.query.id}`;
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
			expansions:
				"attachments.media_keys,referenced_tweets.id,referenced_tweets.id.author_id",
			"media.fields": "media_key,preview_image_url,url",
			"tweet.fields": "attachments,referenced_tweets,entities",
			"user.fields": "id,name,username,profile_image_url",
		};
		const tweet = await client.get(endpoint, parameters);
		// console.log(tweet.data);
		res.status(200).json(tweet.data);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
};
