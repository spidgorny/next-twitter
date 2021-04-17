import { Session } from "next-auth";
import { Image, Nav, Navbar } from "react-bootstrap";

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
					<Nav.Link href="/api/following" className="text-white">
						following
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
