import { Card, Spinner } from "react-bootstrap";
import { useQuery } from "react-query";
import { Includes, Tweet } from "./one-follower";
import { Follower } from "./following";
import axios from "axios";
import { MdOpenInNew } from "react-icons/md";
import ReplyTo from "./reply-to";
import { useSession } from "next-auth/client";
import { useEffect, useState } from "react";

export default function TweetBox(props: {
	user: Follower;
	tweet: Tweet;
	includes?: Includes;
	expand: boolean;
}) {
	const [session, loading] = useSession();
	const [image, setImage] = useState<string>();
	const [subtweet, setSubtweet] = useState<Tweet>();
	let tweetLink =
		"https://twitter.com/" + props.user.username + "/status/" + props.tweet.id;

	const { isLoading, error, data } = useQuery(
		["embed", props.tweet.id],
		async () => {
			const url = new URL("/api/embed", document.location.href);
			url.searchParams.set("tweetLink", tweetLink);
			url.searchParams.set("cards", "visible");
			const res = await axios.get(url.toString());
			return res.data;
		},
		{
			refetchOnWindowFocus: false,
			cacheTime: 1000 * 60 * 60 * 24, // 1 day
		}
	);

	useEffect(() => {
		if ("attachments" in props.tweet) {
			// console.log(props.tweet, props.includes);
			const firstMediaKey = props.tweet.attachments?.media_keys[0];
			const media = props.includes?.media?.filter(
				(el) => el.media_key === firstMediaKey
			)?.[0];
			if (media) {
				setImage(media.preview_image_url ?? media.url);
			}
		}
	}, [image, setImage]);

	useEffect(() => {
		console.log(props.tweet);
		console.log(props.includes);

		if (!image && props.expand) {
			let firstReference = props.tweet.referenced_tweets?.[0];
			// console.log({ firstReference });
			if (firstReference) {
				const refTweets = props.includes?.tweets?.filter(
					(el) => el.id === firstReference.id
				);
				// console.log({ refTweets });
				if (refTweets) {
					const refTweet = refTweets[0];
					refTweet.author_username = props.tweet.entities?.urls?.[0].expanded_url.split(
						"/"
					)[3];
					setSubtweet(refTweet);
					// let firstMediaKey = refTweet?.attachments?.media_keys?.[0];
					// console.log({ firstMediaKey });
					// if (firstMediaKey) {
					// 	const mediaMatching = props.includes?.media?.filter(
					// 		(el) => el.media_key === firstMediaKey
					// 	);
					// 	console.log({ mediaMatching });
					// 	if (mediaMatching) {
					// 		const media = mediaMatching[0];
					// 		if (media) {
					// 			console.log({ media });
					// 			image = media.preview_image_url ?? media.url;
					// 		}
					// 	}
					// }
				}
			}
		}
	}, [image]);

	return (
		<Card className="p-0" style={{ flexGrow: 1, flexBasis: 300 }}>
			{image && <Card.Img variant="top" src={image} />}
			<Card.Body>
				<div className="clearfix">
					<div className="float-right">
						<a href={tweetLink} target="twitter">
							<MdOpenInNew />
						</a>
					</div>
					<div className="">
						{!data && props.tweet.text}
						{isLoading && <Spinner animation="border" size="sm" />}
						{data && <span dangerouslySetInnerHTML={{ __html: data.html }} />}
						{subtweet && (
							<TweetBox
								user={{
									id: subtweet.author_id,
									username: subtweet.author_username,
									profile_image_url: "",
									name: subtweet.author_id,
									screen_name: subtweet.author_id,
								}}
								tweet={subtweet}
								expand={true}
							/>
						)}
					</div>
				</div>
			</Card.Body>
			{session && (
				<Card.Footer>
					<ReplyTo user={props.user} tweet={props.tweet} />
				</Card.Footer>
			)}
		</Card>
	);
}
