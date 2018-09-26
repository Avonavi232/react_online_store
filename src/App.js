import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import PropTypes from 'prop-types';

import './css/normalize.css';
import './css/font-awesome.min.css';
import './css/style.css';
import './css/style-catalogue.css';
import './css/style-favorite.css';
import './css/style-order.css';

import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/pages/HomePage';
import CataloguePage from './components/pages/CataloguePage';
import FavoritesPage from './components/pages/FavoritesPage';
import ProductPage from './components/pages/ProductPage';
import OrderPage from './components/pages/OrderPage';

import {get, localStorageGetParsedPlugin, localStorageSetParsedPlugin} from "./utils/functions";


class App extends Component {
	constructor(props) {
		super(props);

		localStorageGetParsedPlugin();
		localStorageSetParsedPlugin();

		this.api = 'https://api-neto.herokuapp.com/bosa-noga';
		this.baseurl = 'https://api-neto.herokuapp.com/bosa-noga';

		this.newApi = {
			filters: () => `${this.baseurl}/filters`,
			products: queryStr => `${this.baseurl}/products${queryStr ? `/?${queryStr}` : ''}`,

			createCart: () => `${this.baseurl}/cart`,
			getCart: id => `${this.baseurl}/cart/${id}`,
			updateCart: id => `${this.baseurl}/cart/${id}`,

			order: () => `${this.baseurl}/order`
		};

		this.overlookedStorageKey = 'bosanogaOverlooked';
		this.favoriteStorageKey = 'bosanogaFavorite';
		this.cartStorageKey = 'bosanogaCart';

		this.state = {
			fetching: false,
			categories: [],
			favorites: [],
			cartId: undefined,
			cart: []
		};
	}

	componentDidMount() {
		//Fetch categories
		this.setState({fetching: true}, () => {
			get(`${this.api}/categories`)
					.then(({data}) => {
						this.setState({
							fetching: false,
							categories: data,
							favorites: localStorage.getParsed(this.favoriteStorageKey, [])
						})
					})
		});

		this._initCart();
	}

	getChildContext() {
		return {
			api: this.api,
			newApi: this.newApi,
			overlookedStorageKey: this.overlookedStorageKey,
			favoriteStorageKey: this.favoriteStorageKey
		}
	}

	handleFavoriteToggle = favoriteID => {
		const favoritesLS = localStorage.getParsed(this.favoriteStorageKey, []);

		let favorites;

		if (favoritesLS.includes(favoriteID)) {
			favorites = favoritesLS.filter(id => id !== favoriteID);
		} else {
			favorites = favoritesLS.concat([favoriteID]);
		}

		localStorage.setParsed(this.favoriteStorageKey, favorites);
		this.setState({favorites});
	};

	_createNewCart = body => {
		const {createCart} = this.newApi;

		return fetch(createCart(), {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		})
				.then(responce => responce.json())
				.then(responce => {
					if (responce.status = 'ok') {
						return new Promise(resolve => {
							localStorage.setParsed(this.cartStorageKey, responce.data.id);
							this.setState({
								cartId: responce.data.id,
								cart: [body],
							}, () => resolve());
						})
					} else {
						throw new Error('Create new cart error')
					}
				})
	};

	_initCart = () => {
		const
				{getCart} = this.newApi,
				storageCartId = localStorage.getParsed(this.cartStorageKey, '');

		//Если в ЛС сохранен ID корзины, то проверить его актуальность, отправив запрос
		return new Promise(resolve => {
			if (storageCartId) {
				return fetch(getCart(storageCartId))
						.then(responce => {
							if (responce.status === 200) {
								//Если ID корзины актуален
								return responce.json()
										.then(json => {
											this.setState({
												cartId: json.data.id,
												cart: json.data.products
											}, () => resolve());
										});
							} else {
								resolve();
							}
						})
			} else {
				resolve();
			}
		})
	};

	_updateCart = body => {
		const
				{updateCart} = this.newApi,
				{cartId} = this.state;

		return new Promise((resolve, reject) => {
			return fetch(updateCart(cartId), {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			})
					.then(responce => responce.json())
					.then(responce => {
						if (responce.status = 'ok') {
							resolve();
						} else {
							reject(new Error('Update cart error'));
						}
					})
		})
	};

	handleUpdateCart = product => {
		const
				{getCart} = this.newApi,
				{cartId} = this.state;

		if (cartId) {
			return this._updateCart(product)
					.then(() => fetch(getCart(cartId)))
					.then(responce => {
						if(responce.status === 404) {
							this.setState({
								cart: [],
								cartId: undefined
							})
						} else {
							responce.json()
									.then(({data}) => this.setState({cart: data.products}));
						}
					});
		} else {
			return this._createNewCart(product);
		}
	};

	render() {
		const {fetching, categories, favorites, cart, cartId} = this.state;
		return (
				<div className="app container">
					<Header
							fetching={fetching}
							categories={categories}
							handleUpdateCart={this.handleUpdateCart}
							cart={cart}
					/>

					<Switch>
						<Route exact path="/" render={props =>
								<HomePage
										fetching={fetching}
										categories={categories}
										favorites={favorites}
										handleFavoriteToggle={this.handleFavoriteToggle}
										{...props}
								/>
						}/>

						<Route
								path="/products"
								render={
									props =>
											categories.length ?
													<CataloguePage
															{...props}
															categories={categories}
															handleFavoriteToggle={this.handleFavoriteToggle}
													/> :
													<p>Loading</p>
								}/>

						<Route path="/product" render={props =>
								<ProductPage
										{...props}
										handleUpdateCart={this.handleUpdateCart}
								/>
						}/>

						<Route path="/favorites" render={props =>
								<FavoritesPage
										{...props}
										handleFavoriteToggle={this.handleFavoriteToggle}
										favorites={favorites}
								/>}
						/>

						<Route path="/order" render={props =>
							<OrderPage
									{...props}
									cart={cart}
									cartId={cartId}
									handleUpdateCart={this.handleUpdateCart}
							/>}
						/>
					</Switch>

					<Footer/>
				</div>
		);
	}
}

App.childContextTypes = {
	api: PropTypes.string.isRequired,
	newApi: PropTypes.object.isRequired,
	overlookedStorageKey: PropTypes.string.isRequired,
	favoriteStorageKey: PropTypes.string.isRequired,
};

export default App;

/*
* TODO:
* Страница каталог:
*   * подсветка выбранного фильтра
*   * прелоадеры на загрузку любых частей контента
*   * стартовая сортировка - по цене, а не по популярности
*   * сброс фильтров проверить
*   * поправить верстку дропдаунов в сайдбаре, где мало контента - серая область не по размеру
*   * добавление в избранное
*   * слайдер-блок "вы смотрели"
* */
