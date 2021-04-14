import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/client";

export default function Home() {
	const [session, loading] = useSession();

	return (
		<div className="Home">
			<Head>
				<title>Last 5 tweets</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="main">
				<>
					{!session && (
						<>
							Not signed in <br />
							<button onClick={() => signIn()}>Sign in</button>
						</>
					)}
					{session && (
						<>
							Signed in as <pre>{JSON.stringify(session, null, 2)}</pre> <br />
							<button onClick={() => signOut()}>Sign out</button>
						</>
					)}
				</>
				<div>
					<a href="/api/hello">Hello</a>
				</div>
				<div>
					<a href="/api/followers">followers</a>
				</div>
			</main>

			<footer className="footer">&copy;</footer>
		</div>
	);
}
