import React from 'react';

class Footer extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let year = new Date().getFullYear();
		return (
			<footer>
				<p>Copyright <a href="http://krgamestudios.com">KR Game Studios</a> 2016-{year}</p>
			</footer>
		);
	};
}

export default Footer;
