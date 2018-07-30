import React from 'react';
import PropTypes from "prop-types";
import {get} from "../../utils/functions";

import FeaturedView from './FeaturedView';

export default class FeaturedContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			categories: [],
			activeCategory: undefined,
			activePos: undefined,
			activeItem: undefined,
			items: [],
			sliderItems: [],
			fetching: false
		}
	}

	componentDidMount() {
		//Fetch featured items
		const {api} = this.context;

		Promise.all([
			get(`${api}/categories`),
			get(`${api}/featured`)
		])
				.then(values => {
					const
							categories = values[0].data,
							items = values[1].data;

					this.setState({
						categories,
						items,
						activeCategory: categories[2],
						activePos: 1
					}, () => {
						this.updateSlider();
					})
				});
	}

	prepareSliderItems(activePos, stack) {
		let first;

		if ((activePos - 1) < 0) {
			first =
					<div
							key="1"
							className="new-deals__product new-deals__product_stub"
					/>
		} else {
			first =
					<div
							key="1"
							style={{backgroundImage: `url(${stack[activePos - 1].images[0]})`}}
							className="new-deals__product new-deals__product_first"
							onClick={() => this.setActivePos('decr')}
					>

					</div>
		}

		const active =
				<div
						key="2"
						style={{backgroundImage: `url(${stack[activePos].images[0]})`}}
						className="new-deals__product new-deals__product_active"
				>
					<a href="catalogue.html">{stack[activePos].title}</a>
					<div className="new-deals__product_favorite"></div>
				</div>;

		let last;
		if ((activePos + 1) > (stack.length - 1)) {
			last =
					<div
							key="3"
							className="new-deals__product new-deals__product_stub"
					/>
		} else {
			last =
					<div
							key="3"
							style={{backgroundImage: `url(${stack[activePos + 1].images[0]})`}}
							className="new-deals__product new-deals__product_last"
							onClick={() => this.setActivePos('incr')}
					>

					</div>
		}

		this.setState({
			sliderItems: [first, active, last],
			activeItem: stack[activePos]
		});
	}

	setActiveCategory = ({target}) => {
		const targetCatId = target.dataset.id;

		const activeCategory = this.state.categories.find(cat => cat.id === parseInt(targetCatId, 10));

		this.setState({
			activeCategory
		})
	};

	setActivePos = type => {
		const {activePos} = this.state;
		if (type === 'decr') {
			if (activePos < 1) {
				return;
			} else {
				this.setState({
					activePos: activePos - 1
				})
			}
		} else {
			const {items, activeCategory} = this.state;
			const stack = this.getFilteredItems(items, activeCategory);
			if (activePos === stack.length - 1) {
				return;
			} else {
				this.setState({
					activePos: activePos + 1
				})
			}
		}
	};

	getFilteredItems(items, category) {
		return items.filter(item => item.categoryId === category.id);
	}

	updateSlider() {
		const {items, activeCategory, activePos} = this.state;
		const stack = this.getFilteredItems(items, activeCategory);
		this.prepareSliderItems(activePos, stack);
	}

	componentDidUpdate(prevProps, prevState) {
		if (!prevState.activeCategory || !this.state.activeCategory.id || this.state.activePos === null) {
			return;
		}


		if ((prevState.activeCategory.id !== this.state.activeCategory.id) || (prevState.activePos !== this.state.activePos)) {

			this.updateSlider();
		}
	}

	render() {
		const {categories, sliderItems, activeItem, activeCategory} = this.state;
		const props = {
			categories,
			sliderItems,
			activeItem,
			activeCategory,
			setActiveCategory: this.setActiveCategory,
			setActivePos: this.setActivePos
		};
		return (
				<React.Fragment>
					{
						(categories && sliderItems && activeItem) ?
								<FeaturedView {...props}/> :
								<div>Loading</div>
					}
				</React.Fragment>
		)
	}
}

FeaturedContainer.contextTypes = {
	api: PropTypes.string.isRequired
};