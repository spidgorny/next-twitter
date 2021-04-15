import { Button, Jumbotron } from "react-bootstrap";
import ReactPlaceholder from "react-placeholder";
import {
	RectShape,
	RoundShape,
	TextBlock,
	TextRow,
} from "react-placeholder/lib/placeholders";
import "react-placeholder/lib/reactPlaceholder.css";

export function TweetsPlaceholder(props: { animation?: boolean }) {
	const awesomePlaceholder = (
		<div className="my-awesome-placeholder">
			<div className="d-flex p-3">
				<RoundShape color="#E0E0E0" style={{ width: 50, height: 50 }} />
				<TextRow color="#E0E0E0" className="flex-grow-1 p-3 mx-3" />
			</div>
			<div className="d-flex" style={{ gap: "1em" }}>
				<TextBlock rows={7} color="#E0E0E0" />
				<TextBlock rows={7} color="#E0E0E0" />
				<TextBlock rows={7} color="#E0E0E0" />
				<TextBlock rows={7} color="#E0E0E0" />
				<TextBlock rows={7} color="#E0E0E0" />
			</div>
		</div>
	);

	return (
		<ReactPlaceholder
			ready={false}
			customPlaceholder={awesomePlaceholder}
			className="py-3"
			showLoadingAnimation={props.animation}
		>
			<div />
		</ReactPlaceholder>
	);
}

export default function Landing(props: { onClick: () => void }) {
	return (
		<div>
			<Jumbotron className="my-3">
				<h1>Last 5 Tweets</h1>
				<h3>See last updates from all people you follow</h3>
			</Jumbotron>
			<div className="text-center">
				<Button className="mx-auto" onClick={props.onClick}>
					Sign in with Twitter
				</Button>
			</div>

			<TweetsPlaceholder />
			<TweetsPlaceholder />
			<TweetsPlaceholder />
		</div>
	);
}
