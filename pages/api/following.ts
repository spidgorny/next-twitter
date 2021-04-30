import { NextApiRequest, NextApiResponse } from "next";
import jwt, { JWT } from "next-auth/jwt";
import { Follower, FollowingResult } from "../../components/following";

const TwitterV1 = require("twitter-lite");
const TwitterV2 = require("twitter-v2");

if (!process.env.TWITTER_KEY) {
	throw new Error("TWITTER_KEY undefined");
}

type JWTplusToken = JWT &
	Record<string, unknown> & { oauth_token: string; oauth_token_secret: string };

export default async (req: NextApiRequest, res: NextApiResponse) => {
	// @ts-ignore
	const token = await jwt.getToken({ req, secret: process.env.SECRET });

	try {
		if (!token?.id) {
			throw new Error("not logged-in");
		}
		let result;
		console.log(req.query);
		if (req.query.list) {
			result = await fetchListMembers(
				(token as unknown) as JWTplusToken,
				req.query.list as string,
				parseInt(req.query.nextToken as string, 10) as number,
				res
			);
		} else {
			let nextToken = req.query.nextToken;
			result = await fetchFollowing(
				(token as unknown) as JWTplusToken,
				nextToken as string,
				res
			);
		}
		if (result) {
			res.status(200).json({
				status: "ok",
				data: result.data,
				meta: result.meta,
				headers: result.headers,
			});
		}
	} catch (e) {
		console.error(e);
		const error = e as Error;
		res.status(500).json({ error: error.message, stack: error.stack });
	}
};

async function fetchFollowing(
	token: JWTplusToken,
	nextToken: string,
	res: NextApiResponse
): Promise<FollowingResult | undefined> {
	const client = new TwitterV2({
		consumer_key: process.env.TWITTER_KEY,
		consumer_secret: process.env.TWITTER_SECRET,
		access_token_key: token.oauth_token,
		access_token_secret: token.oauth_token_secret,
	});

	const debug = process.env.NODE_ENV === "development";
	let parameters: any = {
		max_results: debug ? 10 : 50,
		"user.fields": "profile_image_url",
	};
	if (nextToken) {
		parameters.pagination_token = nextToken;
	}
	// https://developer.twitter.com/en/docs/twitter-api/users/follows/api-reference/get-users-id-following
	let twitterEndpoint = `users/${token.id}/following`;
	const result = await client.get(twitterEndpoint, parameters);
	res.setHeader("cache-control", "public, maxage=3600");
	console.log({ fetchFollowing: result });
	if (result.text) {
		res.status(500).json({ error: result.text, headers: result.headers });
		return;
	}
	return {
		data: result.data?.data,
		meta: result.data?.meta,
		headers: result.headers,
	};
}

interface ListsMembers {
	previous_cursor: number;
	previous_cursor_str: string;
	next_cursor: number;
	next_cursor_str: string;
	users: Follower[];
}

async function fetchListMembers(
	token: JWTplusToken,
	list: string,
	cursor: number | undefined,
	res: NextApiResponse
): Promise<FollowingResult> {
	// https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/create-manage-lists/api-reference/get-lists-members
	const twitterEndpoint = "lists/members";
	const client = new TwitterV1({
		consumer_key: process.env.TWITTER_KEY,
		consumer_secret: process.env.TWITTER_SECRET,
		access_token_key: token.oauth_token,
		access_token_secret: token.oauth_token_secret,
	});
	const debug = process.env.NODE_ENV === "development";
	console.log(twitterEndpoint, token, list);
	let parameters = {
		count: debug ? 10 : 50,
		list_id: list,
		include_entities: false,
		skip_status: true,
	};
	if (cursor) {
		// @ts-ignore
		parameters.cursor = cursor;
	}
	const result: ListsMembers = await client.get(twitterEndpoint, parameters);
	console.log({ fetchListMembers: result });
	res.setHeader("cache-control", "public, maxage=3600");
	return {
		data: result.users.map((el: Follower) => ({
			...el,
			username: el.screen_name as string,
		})),
		meta: {
			previous_cursor: result.previous_cursor,
			previous_cursor_str: result.previous_cursor_str,
			next_cursor: result.next_cursor,
			next_cursor_str: result.next_cursor_str,
		},
		headers: [],
	};
}
