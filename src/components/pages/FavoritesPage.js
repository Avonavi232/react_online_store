import React from 'react';
import PropTypes from "prop-types";
import {parse} from 'query-string';

import Breadcrumbs from '../Breadcrumbs';
import CatalogueSidebar from '../CatalogueSidebar';
import ProductsFeed from '../ProductsFeed';
import CatalogueSlider from '../CatalogueSlider';
import {get, serialize} from "../../utils/functions";

import '../../css/style-catalogue.css';

class FavoritesPage extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			feed: [],
			feedLength: undefined,
			pagesCount: undefined,
			filters: {
				sortBy: undefined,
				page: 1,
				id: []
			}
		}
	}


	componentDidMount() {
		const
				{favoriteStorageKey} = this.context,
				favoritesIdArray = localStorage.getParsed(favoriteStorageKey, []);

		this.setState({
			filters: {
				...this.state.filters,
				id: favoritesIdArray
			}
		})
	}

	componentDidUpdate(prevProps, prevState) {
		if (serialize(this.state.filters) !== serialize(prevState.filters)) {
			this.getFilteredProducts(serialize(this.state.filters))
					.then(responce => {
						this.setState({
							feed: responce.data,
							feedLength: responce.goods,
							pagesCount: responce.pages
						})
					});
		}
	}

	getFilteredProducts = filters => {
		const {products} = this.context.newApi;

		return new Promise(resolve => {
			get(products(filters))
					.then(responce => resolve(responce));
		})
	};


	render() {
		const {feed, feedLength} = this.state;
		return (
				<React.Fragment>
					{
						feed.length ?
								<ProductsFeed
										feedTitle="В вашем избранном"
										feedSubtitle={`${feedLength} наименований`}
										feedArray={feed}
								/> :
								<p>loading</p>
					}
				</React.Fragment>
		)
	}
}

FavoritesPage.contextTypes = {
	newApi: PropTypes.object.isRequired,
	favoriteStorageKey: PropTypes.string.isRequired
};

FavoritesPage.propTypes = {
	handleFavoriteToggle: PropTypes.func.isRequired
};

export default FavoritesPage;