import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/client";
import Following from "../components/following";
import { Container, Spinner } from "react-bootstrap";
import Landing from "../components/landing";
import { Header } from "./header";

export default function Home() {
	const [session, loading] = useSession();

	return (
		<div className="Home">
			<Head>
				<title>Last 5 tweets</title>
				<link rel="icon" href="/favicon.ico" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<Header
				session={session}
				onClick={() => signIn("twitter")}
				onClick1={() => signOut()}
			/>
			<main className="main">
				<Container fluid>
					{loading ? (
						<Spinner animation="border" />
					) : (
						<>
							{!session && <Landing onClick={() => signIn("twitter")} />}
							{session && <Following />}
						</>
					)}
				</Container>
			</main>
		</div>
	);
}
