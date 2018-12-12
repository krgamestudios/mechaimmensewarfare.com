import React from "react";
import { Header } from "semantic-ui-react";
import LinkButton from "../panels/link_button.jsx";

class NotFound extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="centeredPage">
				<Header as="h1">Page Not Found</Header>
				<LinkButton to="/">Return Home</LinkButton>
			</div>
		);
	}
}

export default NotFound;