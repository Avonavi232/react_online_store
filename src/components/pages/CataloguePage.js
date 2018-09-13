import React from 'react';
import PropTypes from "prop-types";
import {parse} from 'query-string';

import Breadcrumbs from '../Breadcrumbs';
import CatalogueSidebar from '../CatalogueSidebar';
import CatalogueFeed from '../CatalogueFeed';
import CatalogueSlider from '../CatalogueSlider';
import {get, serialize, transliterate} from "../../utils/functions";

import '../../css/style-catalogue.css';

class CataloguePage extends React.Component {
	constructor(props, context) {
		super(props, context);

		const categoryId = parse(this.props.location.search).category;

		this.state = {
			categoryName: this.props.categories.find(el => el.id === Number(categoryId)).title,
			feed: undefined,
			pages: undefined,
			goods: undefined,
			feedUpdated: true,
			filters: {
				page: 1,
				categoryId,
				maxPrice: undefined,
				minPrice: undefined,
				type: undefined,
				color: undefined
			},
			availableFilters: undefined
		}
	}

	componentDidMount() {
		const filters = serialize(this.state.filters);

		Promise.all([
			this.getFilteredProducts(filters),
			this.getAllFilterValues()
		])
				.then(responce => {
					this.setState({
						pages: responce[0].pages,
						goods: responce[0].goods,
						feed: responce[0].data,
						availableFilters: responce[1]
					})
				});
	}

	componentDidUpdate(prevProps) {
		const
				filters = serialize(this.state.filters),
				categoryId = parse(this.props.location.search).category,
				prevCategoryId = parse(prevProps.location.search).category,
				categoryName = this.props.categories.find(el => el.id === Number(categoryId)).title;

		if (categoryId !== prevCategoryId) {
			this.setState({
				feedUpdated: false,
				categoryName,
				filters: {
					page: 1,
					categoryId,
					maxPrice: undefined,
					minPrice: undefined,
					type: undefined,
					color: undefined
				}
			})
		}

		if (!this.state.feedUpdated) {
			this.getFilteredProducts(filters)
					.then(responce => {
						this.setState({
							feedUpdated: true,
							pages: responce.pages,
							goods: responce.goods,
							feed: responce.data
						})
					});
		}
	}

	handleUpdatePriceFilter = (minPrice, maxPrice) => {
		this.setState({
			feedUpdated: false,
			filters: {
				...this.state.filters,
				maxPrice,
				minPrice
			}
		});
	};

	handleSelectPage = (page) => {
		this.setState({
			feedUpdated: false,
			filters: {
				...this.state.filters,
				page
			}
		});
	};

	handleSelectFilter = filterObject => {
		this.setState({
			feedUpdated: false,
			filters: {
				...this.state.filters,
				...filterObject
			}
		});
	};

	getAllFilterValues = () => {
		const {filters} = this.context.newApi;

		return new Promise(resolve => {
			get(filters())
					.then(({data: filters}) => resolve(filters));
		});
	};

	getFilteredProducts = filters => {
		const {products} = this.context.newApi;

		return new Promise(resolve => {
			get(products(filters))
					.then(responce => resolve(responce));
		})
	};

	render() {
		const {feed, goods, pages, categoryName, availableFilters} = this.state;
		return (
				<React.Fragment>
					<Breadcrumbs/>
					<main className="product-catalogue clearfix">
						{
							availableFilters ?
									<CatalogueSidebar
											onSelectFilter={this.handleSelectFilter}
											availableFilters={availableFilters}
											onChangePriceFilter={this.handleUpdatePriceFilter}
									/> :
									undefined
						}
						{
							pages && goods && feed ?
									<CatalogueFeed
											feed={feed}
											goods={goods}
											pages={pages}
											page={this.state.filters.page}
											categoryName={categoryName}
											onSelectPage={this.handleSelectPage}
									/> :
									undefined
						}
					</main>
					{/*<CatalogueSlider/>*/}
				</React.Fragment>
		)
	}
}

CataloguePage.contextTypes = {
	newApi: PropTypes.object.isRequired
};

export default CataloguePage;