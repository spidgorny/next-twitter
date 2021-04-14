import {NextApiRequest, NextApiResponse} from "next";

const Twitter = require('twitter-v2');

if (!process.env.TWITTER_KEY) {
	throw new Error('TWITTER_KEY undefined');
}

const client = new Twitter({
	consumer_key: process.env.TWITTER_KEY,
	consumer_secret: process.env.TWITTER_SECRET,
	// access_token_key: '',
	// access_token_secret: '',
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const {data} = await client.get('tweets', {ids: '1228393702244134912'});
	console.log(data);
	res.status(200).json(data)
}
