import { Tweet } from "./one-follower";
import TweetBox from "./tweet-box";
import { useQuery } from "react-query";
import axios from "axios";

export default function FetchTweet(props: { tweet: Tweet }) {
	const { isLoading, error, data } = useQuery(
		["tweet", props.tweet.id],
		async () => {
			const url = new URL("/api/tweet", document.location.href);
			url.searchParams.set("id", props.tweet.id);
			const res = await axios.get(url.toString());
			console.log(res.data);
			return res.data;
		},
		{
			refetchOnWindowFocus: false,
			// cacheTime: 1000 * 60 * 60 * 24, // 1 day
			cacheTime: 0,
			initialData: {
				data: props.tweet,
				includes: {
					users: [props.tweet.user],
				},
			},
		}
	);

	return (
		<div>
			<TweetBox
				user={data.includes?.users[0]}
				tweet={data.data}
				includes={data?.includes}
				expand={false}
			/>
		</div>
	);
}
