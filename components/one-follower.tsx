import { Alert, Button, Image, Spinner } from "react-bootstrap";
import { useQuery, useQueryClient } from "react-query";
import TweetBox from "./tweet-box";
import { Follower } from "./following";
import axios from "axios";
import { useState } from "react";
import { MdRefresh } from "react-icons/md";

export interface Tweet {
	id: string;
	text: string;
	attachments?: {
		media_keys: string[];
	};
}

export interface Includes {
	media: {
		media_key: string;
		type: "photo" | "video";
		url: string;
		preview_image_url?: string;
	}[];
}

export default function OneFollower(props: { user: Follower }) {
	const [includes, setIncludes] = useState<Includes>();
	const queryClient = useQueryClient();
	const { isLoading, error, data, refetch, isFetching } = useQuery<
		Tweet[],
		Error
	>(
		["tweets", props.user.id],
		async () => {
			let url = new URL("/api/tweets", document.location.href);
			url.searchParams.set("user", props.user.id);
			const res = await axios.get(url.toString());
			setIncludes(res.data.includes);
			return res.data.data;
		},
		{
			refetchOnWindowFocus: false,
			cacheTime: 1000 * 60 * 30, // 30 minutes
		}
	);

	// console.log(props.user, data);
	return (
		<div className="py-3">
			<div className="pb-1 d-flex flex-row justify-content-between">
				<div className="flex-grow-1">
					<Image
						src={props.user.profile_image_url}
						roundedCircle
						className="mr-3"
					/>
					<a
						href={"https://twitter.com/" + props.user.username}
						target="twitter"
					>
						<h5 className="d-inline">{props.user.name}</h5>
						<p className="d-inline px-3">@{props.user.username}</p>
					</a>
				</div>
				<div>
					<Button
						variant="light"
						onClick={() => {
							queryClient.invalidateQueries(["tweets", props.user.id]);
							refetch();
						}}
						disabled={isFetching}
					>
						{isFetching ? (
							<Spinner animation="border" size="sm" />
						) : (
							<MdRefresh />
						)}
					</Button>
				</div>
			</div>
			{isLoading && <Spinner animation="border" size="sm" />}
			{error && <Alert>{error.message}</Alert>}
			{data && (
				<div className="d-flex flex-wrap" style={{ gap: "10px" }}>
					{data.map((tweet: Tweet) => (
						<TweetBox
							key={tweet.id}
							user={props.user}
							tweet={tweet}
							includes={includes}
						/>
					))}
				</div>
			)}
		</div>
	);
}
