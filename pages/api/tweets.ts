import { NextApiRequest, NextApiResponse } from "next";

const Twitter = require("twitter-v2");

if (!process.env.TWITTER_KEY) {
	throw new Error("TWITTER_KEY undefined");
}

const client = new Twitter({
	consumer_key: process.env.TWITTER_KEY,
	consumer_secret: process.env.TWITTER_SECRET,
	// access_token_key: '',
	// access_token_secret: '',
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const user = req.query.user;
	let endpoint = `users/${user}/tweets`;
	console.log(endpoint);
	try {
		const { data } = await client.get(endpoint, {
			exclude: "retweets,replies",
			max_results: 5,
			expansions: "attachments.media_keys",
			"media.fields": "media_key,preview_image_url,url",
		});
		// console.log(data);
		res.status(200).json(data);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
};
