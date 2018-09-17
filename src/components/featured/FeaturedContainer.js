import React from 'react';
import PropTypes from "prop-types";
import {get} from "../../utils/functions";
import {Link} from 'react-router-dom';

import FeaturedView from './FeaturedView';

export default class FeaturedContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: [],
            activeCategory: undefined,
            activePos: undefined,
            activeItem: undefined,
            featuredItems: [],
            sliderItems: [],
            fetching: false
        }
    }

    componentDidMount() {
        //Fetch featured items
        const {api} = this.context;

        get(`${api}/featured`)
            .then(({data}) => {
                /*Отфильтруем категории от пустых*/
                const
                    featuredItems = data,
                    categories = this.props.categories
                        .filter(category => featuredItems.find(item => item.categoryId === category.id))
                        .sort((a, b) => a.id > b.id);

                this.setState({
                    categories,
                    featuredItems,
                    activeCategory: categories[0],
                    activePos: 1
                }, () => {
                    this.updateSlider();
                })
            });
    }

    isProductInFavorites(productId){
			const
					{favoriteStorageKey} = this.context,
					storageStr = localStorage.getItem(favoriteStorageKey),
					storageParsed = storageStr ? JSON.parse(storageStr) : [];

			return storageParsed.includes(productId);
    }

    prepareSliderItems(activePos, stack) {
        let first;

        const activeInFavorites = this.isProductInFavorites(stack[activePos].id);

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
                />
        }

        const active =
            <div
                key="2"
                style={{backgroundImage: `url(${stack[activePos].images[0]})`}}
                className="new-deals__product new-deals__product_active"
            >
                <Link to={`/product/?id=${stack[activePos].id}`}/>
                <div
                    onClick={() => this.props.handleFavoriteToggle(stack[activePos].id)}
                    className={`new-deals__product_favorite${activeInFavorites ? ' favorite' : ''}`}
                />
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

    setActiveCategory = (event) => {
        event.preventDefault();
        const targetCatId = event.target.dataset.id;

        const activeCategory = this.state.categories.find(cat => cat.id === parseInt(targetCatId, 10));

        this.setState({
            activeCategory,
            activePos: 1
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
            const {featuredItems, activeCategory} = this.state;
            const stack = this.getFilteredItems(featuredItems, activeCategory);
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
        const {featuredItems, activeCategory, activePos} = this.state;
        const stack = this.getFilteredItems(featuredItems, activeCategory);
        this.prepareSliderItems(activePos, stack);
    }

    componentDidUpdate(prevProps, prevState) {

        if (!prevState.activeCategory || !this.state.activeCategory.id || this.state.activePos === null) {
            return;
        }
        
        if ((prevState.activeCategory.id !== this.state.activeCategory.id) ||
            (prevState.activePos !== this.state.activePos) ||
            (prevProps.favorites.length !== this.props.favorites.length)) {
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

FeaturedContainer.propTypes = {
    // api: PropTypes.string.isRequired
    handleFavoriteToggle: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired,
    favorites: PropTypes.array.isRequired,
};

FeaturedContainer.contextTypes = {
    api: PropTypes.string.isRequired,
    favoriteStorageKey: PropTypes.string.isRequired,
};