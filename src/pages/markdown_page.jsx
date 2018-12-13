import React from "react";
import ReactMarkdown from "react-markdown";
import MarkdownRenderers from "../utilities/markdown_renderers.js";

class MarkdownPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			source: props.source || null,
			body: props.body
		};
	}

	componentDidMount() {
		//if the source is set, grab it from the server and overwrite the body
		if (this.state.source) {
			fetch(this.state.source)
				.then(result => result.text())
				.then(
					result => this.setState({ body: result }),
					error => this.setState({ body: error })
				);
		}
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