import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import PropTypes from 'prop-types';

import './css/normalize.css';
import './css/font-awesome.min.css';
import './css/style.css';

import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/pages/HomePage';
import CataloguePage from './components/pages/CataloguePage';
import ProductPage from './components/pages/ProductPage';

import {get} from "./utils/functions";


class App extends Component {
	constructor(props) {
		super(props);

		this.api = 'https://neto-api.herokuapp.com/bosa-noga';
		this.overlookedStorageKey = 'bosanogaOverlooked';
		this.favoriteStorageKey = 'bosanogaFavorite';

		this.state = {
			fetching: false,
			categories: []
		};
	}

	componentDidMount() {
		//Fetch categories
		this.setState({fetching: true}, () => {
			get(`${this.api}/categories`)
					.then(({data}) => {
						this.setState({
							fetching: false,
							categories: data
						})
					})
		});
	}

	getChildContext() {
		return {
			api: this.api,
			overlookedStorageKey: this.overlookedStorageKey,
			favoriteStorageKey: this.favoriteStorageKey
	}
	}

	addToFavorite = (favoriteID, currentStorage) => {
		get(`${this.api}/products/${favoriteID}`)
				.then(({data}) => {
					currentStorage.push(data);
					localStorage.setItem(this.favoriteStorageKey, JSON.stringify(currentStorage));
				})
	};

	removeFromFavorite = (favoriteID, currentStorage) => {
		const newStorage = currentStorage.filter(el => el.id !== favoriteID);
		localStorage.setItem(this.favoriteStorageKey, JSON.stringify(newStorage));
	};

	handleFavoriteToggle = event => {
		const
				favoriteID = Number(event.currentTarget.dataset.id),
				storageStr = localStorage.getItem(this.favoriteStorageKey),
				storageParsed = storageStr ? JSON.parse(storageStr) : [];

		if (storageParsed.find(el => el.id === favoriteID)) {
			this.removeFromFavorite(favoriteID, storageParsed);
			// event.currentTarget.classList.remove('favorite');
		} else {
			this.addToFavorite(favoriteID, storageParsed);
			// event.currentTarget.classList.add('favorite');
		}

	};

	render() {
		const {fetching, categories} = this.state;
		return (
				<div className="app container">
					<Header fetching={fetching} categories={categories}/>

					<Switch>
						<Route exact path="/" render={props =>
								<HomePage
										fetching={fetching}
										categories={categories}
										handleFavoriteToggle={this.handleFavoriteToggle}
										{...props}
								/>
						}
						/>
						<Route path="/products" component={CataloguePage}/>
						<Route path="/product" component={ProductPage}/>
					</Switch>

					<Footer/>
				</div>
		);
	}
}

App.childContextTypes = {
	api: PropTypes.string.isRequired,
	overlookedStorageKey: PropTypes.string.isRequired,
	favoriteStorageKey : PropTypes.string.isRequired,
};

export default App;
