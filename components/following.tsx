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

interface FollowingResult {
	data: Follower[];
	meta: {
		next_token?: string;
	};
	headers: Record<string, any>;
}

export default function Following() {
	const { isLoading, error, data, refetch, fetchNextPage } = useInfiniteQuery<
		FollowingResult,
		Error
	>(
		"following",
		async (context: { pageParam?: string }) => {
			try {
				let url = "/api/following";
				let params = {
					nextToken: context.pageParam !== null ? context.pageParam : undefined,
				};
				console.warn(url, params);
				const res = await axios.get(url, {
					params,
				});
				console.log({ pageParam: context.pageParam, data: res.data });
				return res.data;
			} catch (e) {
				console.error(e);
				throw e;
			}
		},
		{
			keepPreviousData: true,
			refetchOnWindowFocus: false,
			cacheTime: 1000 * 60 * 60 * 24, // 1 day
			getNextPageParam: (lastPage, pages) => {
				console.log("getNextPageParam", lastPage);
				return lastPage.meta?.next_token;
			},
		}
	);

	const nextToken = () => {
		return data ? data.pages[data.pages.length - 1].meta?.next_token : null;
	};

	const loadFunc = useCallback(() => {
		console.log("loadFunc", nextToken());
		fetchNextPage().then(() => {});
	}, [fetchNextPage, nextToken]);

	const debug = () => process.env.NODE_ENV === "development";

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
				hasMore={!!nextToken()}
				loader={
					<div className="loader" key={0}>
						<Spinner animation="border" size="sm" /> Loading ...
					</div>
				}
			>
				<div className="sections">
					{data &&
						data.pages.map(
							(section: FollowingResult) =>
								section.data &&
								section.data.map((follower: Follower) => (
									<OneFollower key={follower.id} user={follower} />
								))
						)}
				</div>
			</InfiniteScroll>
		</div>
	);
}
