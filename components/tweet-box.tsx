import { Alert, Card, Container, Spinner } from "react-bootstrap";
import { useQuery } from "react-query";
import { Tweet } from "./one-follower";
import { Follower } from "./following";
import axios from "axios";

export default function TweetBox(props: { user: Follower; tweet: Tweet }) {
	let tweetLink =
		"https://twitter.com/" + props.user.username + "/status/" + props.tweet.id;

	const { isLoading, error, data } = useQuery(
		["embed", props.tweet.id],
		() => {
			const url = new URL("/api/embed", document.location.href);
			url.searchParams.set("tweetLink", tweetLink);
			return axios.get(url.toString()).then((res) => res.data);
		},
		{
			refetchOnWindowFocus: false,
			cacheTime: 1000 * 60 * 60 * 24, // 1 day
		}
	);

	return (
		<Card className="p-3" style={{ flexGrow: 1, flexBasis: 300 }}>
			<div className="clearfix">
				<div className="float-right">
					<a href={tweetLink} target="twitter">
						[&#x2B77;]
					</a>
				</div>
				<div className="">
					{!data && props.tweet.text}
					{isLoading && <Spinner animation="border" size="sm" />}
					{data && <span dangerouslySetInnerHTML={{ __html: data.html }} />}
				</div>
			</div>
		</Card>
	);
}
