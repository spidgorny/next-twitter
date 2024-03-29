import { Alert, Button, Form, FormControl, Spinner } from "react-bootstrap";
import { useQuery } from "react-query";
import axios from "axios";
import { ChangeEvent } from "react";

export interface Lists {
	lists: {
		id: number;
		id_str: string;
		name: string;
		slug: string;
		member_count: number;
	}[];
}

export default function ListSelector(props: { setList: (id: string) => void }) {
	const { isLoading, error, data, refetch } = useQuery<Lists, Error>(
		"lists",
		async () => {
			const res = await axios.get("/api/lists", {});
			return res.data;
		},
		{
			keepPreviousData: true,
			refetchOnWindowFocus: false,
			cacheTime: 1000 * 60 * 60 * 24, // 1 day
		}
	);

	const listChanged = (e: ChangeEvent) => {
		e.preventDefault();
		const select = e.target as HTMLSelectElement;
		const value = select.value;
		console.log(value);
		props.setList(value);
	};

	return (
		<div className="d-flex justify-content-center">
			<Form>
				{error && (
					<Alert variant="danger">
						<p>{error.message}</p>
						{!isLoading && <Button onClick={() => refetch()}>Try Again</Button>}
					</Alert>
				)}
				{isLoading && (
					<div>
						<Spinner animation="border" size="sm" />
					</div>
				)}
				<FormControl
					as="select"
					placeholder="Loading lists"
					onChange={listChanged}
				>
					<option value="">-- followees --</option>
					{data &&
						data.lists.map((el) => (
							<option value={el.id_str}>
								{el.name} ({el.member_count})
							</option>
						))}
				</FormControl>
			</Form>
		</div>
	);
}
