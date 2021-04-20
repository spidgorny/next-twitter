import { NextApiRequest, NextApiResponse } from "next";
import jwt from "next-auth/jwt";

const Twitter = require("twitter");

if (!process.env.TWITTER_KEY) {
	throw new Error("TWITTER_KEY undefined");
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		// @ts-ignore
		const token = await jwt.getToken({ req, secret: process.env.SECRET });
		console.log({ token });
		let cred = {
			consumer_key: process.env.TWITTER_KEY,
			consumer_secret: process.env.TWITTER_SECRET,
			// bearer_token: process.env.TWITTER_TOKEN,
			access_token_key: token.oauth_token,
			access_token_secret: token.oauth_token_secret,
		};
		console.log({ cred });
		const client = new Twitter(cred);
		let endpoint = `statuses/update`;
		console.log({ endpoint, body: req.body });
		let replyText = req.body.reply_text;
		if (!replyText) {
			throw new Error("missing reply_text");
		}
		let inReplyToStatusId = req.body.in_reply_to_status_id;
		if (!inReplyToStatusId) {
			throw new Error("missing in_reply_to_status_id");
		}
		const { data } = await client.post(endpoint, {
			status: replyText,
			in_reply_to_status_id: inReplyToStatusId,
		});
		console.log({ data });
		res.status(200).json(data);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: e.message });
	}
};
