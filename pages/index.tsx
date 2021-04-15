import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/client";
import Following from "../components/following";
import { Container, Image, Nav, Navbar } from "react-bootstrap";
import Landing from "../components/landing";
import { Session } from "next-auth";

export function Header(props: {
	session: Session | null | undefined;
	onClick: () => Promise<void>;
	onClick1: () => Promise<void>;
}) {
	return (
		<Navbar bg="dark" expand="lg" className="text-white">
			<Navbar.Brand href="." className="text-white">
				Last 5 Tweets
			</Navbar.Brand>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav">
				<Nav className="mr-auto text-white">
					<Nav.Link href="." className="text-white">
						Home
					</Nav.Link>
					<Nav.Link href="/api/hello" className="text-white">
						Hello
					</Nav.Link>
					<Nav.Link href="/api/followers" className="text-white">
						followers
					</Nav.Link>
				</Nav>
				<Navbar.Text>
					{!props.session && <button onClick={props.onClick}>Sign in</button>}
				</Navbar.Text>

				{props.session && (
					<Navbar.Text className="text-white">
						{props.session.user.image && (
							<Image src={props.session.user.image} roundedCircle />
						)}
						<span className="px-3">{props.session.user.name}</span>
						<button onClick={props.onClick1}>Sign out</button>
					</Navbar.Text>
				)}
			</Navbar.Collapse>
		</Navbar>
	);
}

export default function Home() {
	const [session, loading] = useSession();

	return (
		<div className="Home">
			<Head>
				<title>Last 5 tweets</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Header
				session={session}
				onClick={() => signIn("twitter")}
				onClick1={() => signOut()}
			/>
			<main className="main">
				<Container fluid>
					{!session && <Landing onClick={() => signIn("twitter")} />}
					{session && <Following />}
				</Container>
			</main>
		</div>
	);
}
