import { Card, Spinner } from "react-bootstrap";
import { useQuery } from "react-query";
import { Includes, Tweet } from "./one-follower";
import { Follower } from "./following";
import axios from "axios";
import { MdOpenInNew } from "react-icons/md";

export default function TweetBox(props: {
	user: Follower;
	tweet: Tweet;
	includes?: Includes;
}) {
	let tweetLink =
		"https://twitter.com/" + props.user.username + "/status/" + props.tweet.id;

	const { isLoading, error, data } = useQuery(
		["embed", props.tweet.id],
		async () => {
			const url = new URL("/api/embed", document.location.href);
			url.searchParams.set("tweetLink", tweetLink);
			const res = await axios.get(url.toString());
			return res.data;
		},
		{
			refetchOnWindowFocus: false,
			cacheTime: 1000 * 60 * 60 * 24, // 1 day
		}
	);

	let image = null;
	if ("attachments" in props.tweet) {
		// console.log(props.tweet, props.includes);
		const firstMediaKey = props.tweet.attachments?.media_keys[0];
		const media = props.includes?.media.filter(
			(el) => el.media_key === firstMediaKey
		)?.[0];
		if (media) {
			image = media.preview_image_url ?? media.url;
		}
	}

	return (
		<Card className="p-3" style={{ flexGrow: 1, flexBasis: 300 }}>
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
					</div>
				</div>
			</Card.Body>
		</Card>
	);
}
