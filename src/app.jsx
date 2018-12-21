import React from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { Header, Container, Divider } from "semantic-ui-react";

//include tools
import GA from './utilities/google_analytics.jsx';

//include styles
import "./styles/shared.css";

//include other pages
import MarkdownPage from "./pages/markdown_page.jsx";
import CardList from "./pages/card_list.jsx";
import NotFound from "./pages/not_found.jsx";

//include panels
import LinkButton from "./panels/link_button.jsx";
import Footer from "./panels/footer.jsx";

class App extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		//NOTE: display: flex is set for the container to fix a centering issue in NotFound
		return (
			<div className="central">
				<BrowserRouter>
					<Container className="panel" style={{ display: "flex" }}>
						{ GA.init() && <GA.RouteTracker /> }
						<Link to="/"><Header as="h1" textAlign="center">Mecha: Immense Warfare</Header></Link>
						<LinkButton.Group widths="4">
							<LinkButton to="/rules" className="noPadding">Rules</LinkButton>
							<LinkButton to="/cardlist" className="noPadding">Card List</LinkButton>
							<LinkButton to="/concepts" className="noPadding">Concepts</LinkButton>
							<LinkButton to="/about" className="noPadding">About</LinkButton>
						</LinkButton.Group>
						<Divider hidden />
						<Switch>
							<Route exact path="/" component={() => <MarkdownPage source={"content/landing.md"} /> } />
							<Route exact path="/rules" component={() => <MarkdownPage source={"content/rules.md"} /> } />
							<Route exact path="/cardlist" component={ CardList } />
							<Route exact path="/concepts" component={() => <MarkdownPage source={"content/concepts.md"} /> } />
							<Route exact path="/about" component={() => <MarkdownPage source={"content/about.md"} /> } />

							<Route path="/story/:chapterId" component={(props) => <MarkdownPage source={`/content/story/${props.match.params.chapterId}.md`} /> } />

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