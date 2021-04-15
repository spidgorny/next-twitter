import { Alert, Button, Container, Spinner } from "react-bootstrap";
import { useQuery } from "react-query";
import OneFollower from "./one-follower";
import axios from "axios";
import { TweetsPlaceholder } from "./landing";

export interface Follower {
	id: string;
	name: string;
	username: string;
	profile_image_url: string;
}

export default function Following() {
	const { isLoading, error, data, refetch } = useQuery<Follower[], Error>(
		"following",
		() => {
			try {
				return axios.get("/api/following").then((res) => res.data);
			} catch (e) {
				console.error(e);
				throw e;
			}
		}
	);

	console.log(data);
	return (
		<div className="py-3">
			{error && (
				<Alert variant="danger">
					<p>{error.message}</p>
					{!isLoading && <Button onClick={() => refetch()}>Try Again</Button>}
				</Alert>
			)}
			{isLoading && (
				<div>
					<Spinner animation="border" size="sm" />
					<TweetsPlaceholder />
				</div>
			)}
			{data &&
				data.map((follower: Follower) => (
					<OneFollower key={follower.id} user={follower} />
				))}
		</div>
	);
}
