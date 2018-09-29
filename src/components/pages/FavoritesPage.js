import React from 'react';
import PropTypes from "prop-types";

import FavoritesFeed from '../FavoritesFeed';
import Pagination from '../Pagination';
import {get, serialize, handleSelectFilter} from "../../utils/functions";

const Selector = props => {
    return (
        <select
            id="sorting"
            value={props.value}
            onChange={event => props.onSelectFilter({sortBy: event.currentTarget.value})}
        >
            {
                props.options.map(option =>
                    <option
                        key={option.value}
                        value={option.value}
                    >{option.title}</option>
                )
            }
        </select>
    )
};


class FavoritesPage extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            feed: [],
            feedLength: undefined,
            pagesCount: undefined,
            sortBy: [
                {
                    value: 'popularity',
                    title: 'По популярности'
                },
                {
                    value: 'size',
                    title: 'По размеру'
                },
                {
                    value: 'brand',
                    title: 'По производителю'
                },
                {
                    value: 'price',
                    title: 'По цене'
                }
            ],
            filters: {
                sortBy: undefined,
                page: 1,
                id: []
            }
        };

        this.handleSelectFilter = handleSelectFilter.bind(this);
    }


    componentDidMount() {
        this.setState({
            filters: {
                ...this.state.filters,
                id: this.props.favorites
            }
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (serialize(this.props.favorites) !== serialize(prevProps.favorites)) {
            this.setState({
                filters: {
                    ...this.state.filters,
                    id: this.props.favorites
                }
            })
        }

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
        const
            {feed, feedLength, pagesCount, filters, sortBy} = this.state,
            {handleFavoriteToggle} = this.props;
        return (
            <div className="wrapper wrapper_favorite">
                <main className="product-catalogue product-catalogue_favorite">
                    <section className="product-catalogue__head product-catalogue__head_favorite">
                        <div className="product-catalogue__section-title">
                            <h2 className="section-name">В вашем избранном</h2>
                            <span className="amount">{`${feedLength} наименований`}</span>
                        </div>
                        <div className="product-catalogue__sort-by">
                            <p className="sort-by">Сортировать</p>
                            <Selector
                                value={filters.sortBy}
                                options={sortBy}
                                onSelectFilter={this.handleSelectFilter}
                            />
                        </div>
                    </section>
                    {
                        feed.length ?
                            <FavoritesFeed
                                feedArray={feed}
                                handleFavoriteToggle={handleFavoriteToggle}
                            /> :
                            <p>loading</p>
                    }
                    {
                        pagesCount > 1 ?
                            <Pagination onSelectFilter={this.handleSelectFilter} page={filters.page}
                                        pages={pagesCount}/> :
                            undefined
                    }
                </main>
            </div>
        )
    }
}

FavoritesPage.contextTypes = {
    newApi: PropTypes.object.isRequired,
    favoriteStorageKey: PropTypes.string.isRequired
};

FavoritesPage.propTypes = {
    handleFavoriteToggle: PropTypes.func.isRequired,
    favorites: PropTypes.array.isRequired
};

export default FavoritesPage;