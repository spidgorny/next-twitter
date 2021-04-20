import { Tweet } from "./one-follower";
import { Alert, Button, Form } from "react-bootstrap";
import { IoMdSend } from "react-icons/io";
import { FormEvent, useState } from "react";
import axios from "axios";

export default function ReplyTo(props: { tweet: Tweet }) {
	const [visible, setVisible] = useState<boolean>(false);
	const [sending, setSending] = useState<boolean>(false);
	const [staticText, setStatic] = useState<string>("");
	const [error, setError] = useState<string>("");

	const sendTweet = async (event: FormEvent) => {
		event.preventDefault();
		let form = event.target as HTMLFormElement;
		let textarea = form.elements[0] as HTMLTextAreaElement;
		const reply_text = textarea.value;
		console.log(reply_text);
		if (!reply_text) {
			return;
		}
		setSending(true);
		try {
			const res = await axios.post("/api/reply", {
				reply_text,
				in_reply_to_status_id: props.tweet.id,
			});
			console.log(res.data);
			setVisible(false);
			setStatic(reply_text);
			setError("");
		} catch (e) {
			console.error(e.response);
			setError(e.message);
		}
		setSending(false);
	};

	return (
		<form onSubmit={(e) => sendTweet(e)}>
			<div className="d-flex justify-content-between">
				<div className="flex-grow-1">
					{visible && (
						<Form.Control
							as="textarea"
							name="reply_text"
							autoFocus
							readOnly={sending}
						/>
					)}
					{staticText && <p>{staticText}</p>}
				</div>
				{visible ? (
					<Button variant="default" type="submit" disabled={sending}>
						<IoMdSend />
					</Button>
				) : (
					<Button
						variant="default"
						type="button"
						onClick={() => setVisible(true)}
						style={{ transform: "scaleX(-1)" }}
					>
						<IoMdSend />
					</Button>
				)}
			</div>
			{error && (
				<Alert variant="danger" className="my-1">
					{error}
				</Alert>
			)}
		</form>
	);
}
