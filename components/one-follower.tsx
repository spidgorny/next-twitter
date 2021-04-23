import { Alert, Button, Image, Spinner } from "react-bootstrap";
import { useQuery, useQueryClient } from "react-query";
import TweetBox from "./tweet-box";
import { Follower } from "./following";
import axios from "axios";
import { useState } from "react";
import { MdRefresh } from "react-icons/md";
import { IoMdDoneAll } from "react-icons/io";
import useForceUpdate from "use-force-update";
import { Animated } from "react-animated-css";
import { TweetsPlaceholder } from "./landing";

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
	const forceUpdate = useForceUpdate();
	const [visible, setVisible] = useState(true);
	const [includes, setIncludes] = useState<Includes>();
	const queryClient = useQueryClient();
	const { isLoading, error, data, refetch, isFetching } = useQuery<
		Tweet[],
		Error
	>(
		["tweets", props.user.id],
		async () => {
			const since = localStorage.getItem("done." + props.user.username);
			// console.log({ since });
			let url = new URL("/api/tweets", document.location.href);
			url.searchParams.set("user", props.user.id);
			url.searchParams.set("since", since ?? "");
			const res = await axios.get(url.toString());
			setIncludes(res.data.includes);
			return res.data.data;
		},
		{
			refetchOnWindowFocus: false,
			cacheTime: 1000 * 60 * 30, // 30 minutes
		}
	);

	const markDone = () => {
		setVisible(false);
		localStorage.setItem(
			"done." + props.user.username,
			new Date().toISOString()
		);
		forceUpdate();
		refetch();
	};

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
			{isLoading && <TweetsPlaceholder />}
			{error && <Alert>{error.message}</Alert>}
			{data && (
				<Animated
					animationIn="slideInUp"
					animationOut="fadeOutUp"
					animationInDuration={1000}
					animationOutDuration={1000}
					isVisible={visible}
				>
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
					<div className="text-center py-1">
						<Button variant="success" onClick={() => markDone()}>
							<IoMdDoneAll /> Done with {props.user.username}
						</Button>
					</div>
				</Animated>
			)}
		</div>
	);
}
