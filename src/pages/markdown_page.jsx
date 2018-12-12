import React from "react";
import ReactMarkdown from "react-markdown";
import MarkdownRenderers from "../utilities/markdown_renderers.js";

class MarkdownPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			source: props.source,
			body: "Loading..."
		};
	}

	componentDidMount() {
		fetch(this.state.source)
			.then(result => result.text())
			.then((result) => {
				this.setState({
					body: result
				});
			},
			//handle errors here instead of a catch block because internet said so
			(error) => {
				this.setState({
					body: error
				});
			});
	}

	render() {
		return (
			<div>
				<ReactMarkdown source={this.state.body} renderers={MarkdownRenderers} />
			</div>
		);
	}
}

export default MarkdownPage;