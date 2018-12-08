import React from "react";
import { Table } from "semantic-ui-react";
import Papa from "papaparse";

class CardList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			body: "loading..."
		};
	}

	componentDidMount() {
		fetch("/content/card_list.csv")
			.then(result => result.text())
			.then(result => Papa.parse(result, { delimiter: ";" }).data)
			.then(result => {
				let headers = result[0];
				let content = result.slice(1);

				return this.generateTableJSX(headers, content);
			})
			.then(result => this.setState({ body: result }))
	}

	generateTableJSX(headers, content) {
		headers = headers.map((h, i) => <Table.HeaderCell key={i}>{h}</Table.HeaderCell>);

		content = content.map((r, i) => {
			r = r.map((c, j) => {
				return <Table.Cell key={j}>{c}</Table.Cell>;
			})
			return <tr key={i}>{r}</tr>;
		});

		return (
			<Table unstackable>
				<Table.Header>
					<Table.Row>
						{headers}
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{content}
				</Table.Body>
			</Table>
		);
	}

	render() {
		return (
			<div>
				{this.state.body}
			</div>
		);
	}
}

export default CardList;