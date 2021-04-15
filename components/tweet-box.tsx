import { Alert, Card, Container, Spinner } from "react-bootstrap";
import { useQuery } from "react-query";
import { Tweet } from "./one-follower";
import { Follower } from "./following";

export default function TweetBox(props: { user: Follower; tweet: Tweet }) {
	let tweetLink =
		"https://twitter.com/" + props.user.username + "/status/" + props.tweet.id;

	const { isLoading, error, data } = useQuery(["embed", props.tweet.id], () => {
		const url = new URL("/api/embed", document.location.href);
		url.searchParams.set("tweetLink", tweetLink);
		return fetch(url.toString()).then((res) => res.json());
	});

	return (
		<Card className="p-3 m-1" style={{ width: 350, maxWidth: data?.width }}>
			<div className="d-flex">
				<div className="flex-grow-1">
					{!data && props.tweet.text}
					{isLoading && <Spinner animation="border" size="sm" />}
					{data && <span dangerouslySetInnerHTML={{ __html: data.html }} />}
				</div>
				<div>
					<a href={tweetLink} target="twitter">
						[&#x2B77;]
					</a>
				</div>
			</div>
		</Card>
	);
}
