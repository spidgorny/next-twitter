import { Alert, Container, Spinner } from "react-bootstrap";
import { useQuery } from "react-query";
import OneFollower from "./one-follower";

export interface Follower {
	id: string;
	name: string;
	username: string;
	profile_image_url: string;
}

export default function Following() {
	const { isLoading, error, data } = useQuery("following", () =>
		fetch("/api/following").then((res) => res.json())
	);

	return (
		<>
			{isLoading && <Spinner animation="border" size="sm" />}
			{error && <Alert>{error.message}</Alert>}
			{data &&
				data.map((follower: Follower) => <OneFollower user={follower} />)}
		</>
	);
}
