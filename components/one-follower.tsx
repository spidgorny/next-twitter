import { Alert, Image, Media, Spinner } from "react-bootstrap";
import { useQuery } from "react-query";
import TweetBox from "./tweet-box";
import { Follower } from "./following";

export interface Tweet {
	id: string;
	text: string;
}

export default function OneFollower(props: { user: Follower }) {
	const { isLoading, error, data } = useQuery(["tweets", props.user.id], () => {
		let url = new URL("/api/tweets", document.location.href);
		url.searchParams.set("user", props.user.id);
		return fetch(url.toString()).then((res) => res.json());
	});

	// console.log(props.user, data);
	return (
		<div className="py-3">
			<Media>
				<Image
					src={props.user.profile_image_url}
					roundedCircle
					className="mr-3"
				/>
				<Media.Body>
					<a
						href={"https://twitter.com/" + props.user.username}
						target="twitter"
					>
						<h5 className="d-inline">{props.user.name}</h5>
						<p className="d-inline px-3">@{props.user.username}</p>
					</a>
					{isLoading && <Spinner animation="border" size="sm" />}
					{error && <Alert>{error.message}</Alert>}
					{data && (
						<div className="d-flex flex-wrap">
							{data.map((tweet: Tweet) => (
								<TweetBox key={tweet.id} user={props.user} tweet={tweet} />
							))}
						</div>
					)}
				</Media.Body>
			</Media>
		</div>
	);
}
