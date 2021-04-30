import { Alert, Button, Spinner } from "react-bootstrap";
import { useInfiniteQuery } from "react-query";
import OneFollower from "./one-follower";
import axios from "axios";
import { TweetsPlaceholder } from "./landing";
import InfiniteScroll from "react-infinite-scroller";
import { useCallback, useState } from "react";
import ListSelector from "./list-selector";

export interface Follower {
	id: string;
	name: string;
	username: string;
	screen_name?: string; // this is a username when querying lists/members.json
	profile_image_url: string;
}

export interface FollowingResult {
	data: Follower[];
	meta: {
		next_token?: string;
		previous_cursor?: number;
		previous_cursor_str?: string;
		next_cursor?: number;
		next_cursor_str?: string;
	};
	headers: Record<string, any>;
}

export default function Following() {
	const [list, setList] = useState<string | undefined>(undefined);

	const { isLoading, error, data, refetch, fetchNextPage } = useInfiniteQuery<
		FollowingResult,
		Error
	>(
		"following",
		async (context: { pageParam?: string }) => {
			try {
				let url = "/api/following";
				let params = {
					list,
					nextToken: context.pageParam !== null ? context.pageParam : undefined,
				};
				console.warn(url, params);
				const res = await axios.get(url, {
					params,
				});
				// console.log({ pageParam: context.pageParam, data: res.data });
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
				// console.log("getNextPageParam", lastPage);
				return lastPage.meta?.next_token ?? lastPage.meta?.next_cursor;
			},
		}
	);

	const nextToken = () => {
		if (!data) {
			return null;
		}
		let lastPage = data.pages[data.pages.length - 1];
		return lastPage.meta?.next_token ?? lastPage.meta?.next_cursor;
	};

	const loadFunc = useCallback(() => {
		// console.log("loadFunc", nextToken());
		fetchNextPage().then(() => {});
	}, [fetchNextPage, nextToken]);

	const debug = () => process.env.NODE_ENV === "development";

	// console.log(process.env.NODE_ENV, data);
	return (
		<div className="py-3">
			{debug() && false && (
				<div>
					<pre>{JSON.stringify({ isLoading, error }, null, 2)}</pre>
					<Button onClick={() => refetch()}>refetch</Button>
					<hr />
				</div>
			)}
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
			<ListSelector
				setList={(id: string) => {
					setList(id);
					setTimeout(() => refetch(), 100);
				}}
			/>
			{data && !data.pages[0].data?.length && (
				<Alert variant="warning">No data. Are you following anybody?</Alert>
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
