import React from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { Header, Container, Divider } from "semantic-ui-react";

//include styles
import "./styles/shared.css";

//include other pages
import Landing from "./pages/landing.jsx";
import Rules from "./pages/rules.jsx";
import CardList from "./pages/card_list.jsx";
import Concepts from "./pages/concepts.jsx";
import About from "./pages/about.jsx";
import NotFound from "./pages/not_found.jsx";

//include panels
import LinkButton from "./panels/link_button.jsx";
import Footer from "./panels/footer.jsx";

class App extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="central">
				<BrowserRouter>
					<Container className="panel">
						<Link to="/"><Header as="h1" textAlign="center">Mecha: Immense Warfare</Header></Link>
						<LinkButton.Group widths="4">
							<LinkButton to="/rules" className="noPadding">Rules</LinkButton>
							<LinkButton to="/cardlist" className="noPadding">Card List</LinkButton>
							<LinkButton to="/concepts" className="noPadding">Concepts</LinkButton>
							<LinkButton to="/about" className="noPadding">About</LinkButton>
						</LinkButton.Group>
						<Divider hidden />
						<Switch>
							<Route exact path="/" component={ Landing } />
							<Route exact path="/rules" component={ Rules } />
							<Route exact path="/cardlist" component={ CardList } />
							<Route exact path="/concepts" component={ Concepts } />
							<Route exact path="/about" component={ About } />
							<Route path="*" component={ NotFound } />
						</Switch>
					</Container>
				</BrowserRouter>
				<Footer />
			</div>
		);
	}
}

export default App;