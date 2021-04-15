import { Alert, Button, Container, Spinner } from "react-bootstrap";
import { useInfiniteQuery, useQuery } from "react-query";
import OneFollower from "./one-follower";
import axios from "axios";
import { TweetsPlaceholder } from "./landing";
import InfiniteScroll from "react-infinite-scroller";
import { useCallback, useState } from "react";

export interface Follower {
	id: string;
	name: string;
	username: string;
	profile_image_url: string;
}

export default function Following() {
	const [nextToken, setNextToken] = useState((null as unknown) as string);

	const { isLoading, error, data, refetch, fetchNextPage } = useInfiniteQuery<
		Follower[],
		Error
	>(
		"following",
		async () => {
			try {
				let url = "/api/following";
				let params = { nextToken: nextToken !== null ? nextToken : undefined };
				console.warn(url, params);
				const res = await axios.get(url, {
					params,
				});
				console.log({ nextToken, data: res.data });
				setNextToken(res.data.meta?.next_token);
				return res.data.data;
			} catch (e) {
				console.error(e);
				throw e;
			}
		},
		{ keepPreviousData: true }
	);

	const loadFunc = useCallback(() => {
		console.log("loadFunc", nextToken);
		fetchNextPage().then(() => {});
	}, [fetchNextPage, nextToken]);

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
			<InfiniteScroll
				pageStart={0}
				loadMore={loadFunc}
				hasMore={nextToken === null || !!nextToken}
				loader={
					<div className="loader" key={0}>
						<Spinner animation="border" size="sm" /> Loading ...
					</div>
				}
			>
				<div className="sections">
					{data &&
						data.pages.map((section: Follower[]) =>
							section.map((follower: Follower) => (
								<OneFollower key={follower.id} user={follower} />
							))
						)}
				</div>
			</InfiniteScroll>
		</div>
	);
}
