import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/client";
import Following from "../components/following";
import { Container, Image, Nav, Navbar } from "react-bootstrap";

export default function Home() {
	const [session, loading] = useSession();

	return (
		<div className="Home">
			<Head>
				<title>Last 5 tweets</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Navbar bg="dark" expand="lg" className="text-white">
				<Navbar.Brand href="." className="text-white">
					React-Bootstrap
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
						{!session && (
							<button onClick={() => signIn("twitter")}>Sign in</button>
						)}
					</Navbar.Text>

					{session && (
						<Navbar.Text className="text-white">
							<Image src={session.user.image} roundedCircle />
							<span className="px-3">{session.user.name}</span>
							<button onClick={() => signOut()}>Sign out</button>
						</Navbar.Text>
					)}
				</Navbar.Collapse>
			</Navbar>
			<main className="main">
				<Container fluid>{session && <Following />}</Container>
			</main>
		</div>
	);
}
