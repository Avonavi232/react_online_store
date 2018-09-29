import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';

import App from './App';

// regular imports
ReactDOM.render(
		<Router>
			<App/>
		</Router>,
		document.getElementById('root')
);

if (module.hot) {
	module.hot.accept('./App', () => {
		ReactDOM.render(
				<Router basename={process.env.PUBLIC_URL}>
					<App/>
				</Router>,
				document.getElementById('root')
		);
	})
}

