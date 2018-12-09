import React from "react";
import { Table, Input, Icon, Divider } from "semantic-ui-react";
import Papa from "papaparse";
import tsorter from "../utilities/tsorter.js";

class CardList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			blob: null, //response from the server
			body: "loading...", //parsed table
			tsorter: null, //sorting tool
			query: "" //search query
		};
	}

	componentDidMount() {
		fetch("/content/card_list.csv")
			.then(result => result.text())
			.then(result => Papa.parse(result, { delimiter: ";" }).data)
			.then(result => { this.setState({ blob: result }); return result; })
			.then(result => this.generateTableJSX(result[0], result.slice(1)))
			.then(result => this.setState({ body: result }))
			.then(() => this.setState({ tsorter: tsorter.create("cardtable") })); //NOTE: tsorter operates on raw HTML, so the body must be set first
	}

	generateTableJSX(headers, content) {
		headers = headers.map((h, i) => <Table.HeaderCell key={i}>{h}</Table.HeaderCell>);

		content = content.filter((r) => !r.hidden); //filter out hidden content
		content = content.map((r, i) => { //convert the content to rows and cells
			r = r.map((c, j) => {
				return <Table.Cell key={j}>{c || " "}</Table.Cell>; //NOTE: c || " " because tsorter doesn't like empty strings
			})
			return <tr key={i} display={r.hidden ? "none" : "inline"}>{r}</tr>;
		});

		//NOTE: id must match tsorter's argument above
		return (
			<div className="scrollable">
				<Divider hidden />
				<Table unstackable id={"cardtable"}>
					<Table.Header>
						<Table.Row>
							{headers}
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{content}
					</Table.Body>
				</Table>
			</div>
		);
	}

	updateQuery(evt) {
		this.setState({ query: evt.target.value });

		//search the table (hide all rows in the blob, then reveal the appropriate ones)
		let blob = JSON.parse(JSON.stringify(this.state.blob));

		blob.map((r, i) => {
			r.hidden = true;

			r.map((c, j) => {
				if (c.toLowerCase().indexOf(evt.target.value.toLowerCase()) > -1) {
					r.hidden = false;
				}
			})
		});

		//don't hide the title row
		blob[0].hidden = false;

		//find a change
		for (let i = 0; i < blob.length; i++) {
			if (blob[i].hidden != this.state.blob[i].hidden) {
				//update the table on a change
				this.setState({ blob: blob, body: this.generateTableJSX(blob[0], blob.slice(1)) });
				break;
			}
		}
	}

	render() {
		return (
			<div>
				<div className="rightContent">
					<Input icon placeholder="Search...">
						<input value={this.state.query} onChange={this.updateQuery.bind(this)} />
						<Icon name="search" />
					</Input>
				</div>
				{this.state.body}
			</div>
		);
	}
}

export default CardList;