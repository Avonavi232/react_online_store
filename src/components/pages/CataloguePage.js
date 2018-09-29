import React from 'react';
import PropTypes from "prop-types";

import Breadcrumbs from '../Breadcrumbs';
import CatalogueSidebar from '../CatalogueSidebar';
import CatalogueFeed from '../CatalogueFeed';
import CatalogueSlider from '../CatalogueSlider';
import {get, serialize, transliterate, handleSelectFilter, parseQuery} from "../../utils/functions";


class CataloguePage extends React.Component {
    constructor(props, context) {
        super(props, context);

        const categoryId = parseQuery(this.props.location.search).category;

        this.state = {
            categoryName: this.props.categories.find(el => el.id === Number(categoryId)).title,
            feed: undefined,
            pages: undefined,
            goods: undefined,
            filters: {
                page: 1,
                categoryId,
                ...this.handleResetFilters()
            },
            availableFilters: undefined
        };

        this.handleSelectFilter = handleSelectFilter.bind(this);
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
                    availableFilters: responce[1],
                    filters: {
                        ...this.state.filters,
                        sortBy: responce[1].sortBy[0].value
                    }
                })
            });
    }

    componentDidUpdate(prevProps, prevState) {
        const
            filters = serialize(this.state.filters),
            categoryId = parseQuery(this.props.location.search).category,
            prevCategoryId = parseQuery(prevProps.location.search).category,
            categoryName = this.props.categories.find(el => el.id === Number(categoryId)).title;

        if (categoryId !== prevCategoryId) {
            this.setState({
                categoryName,
                filters: {
                    page: 1,
                    categoryId,
                    ...this.handleResetFilters()
                }
            })
        }

        if (serialize(prevState.filters) !== filters) {
            this.getFilteredProducts(filters)
                .then(responce => {
                    this.setState({
                        pages: responce.pages,
                        goods: responce.goods,
                        feed: responce.data
                    })
                });
        }
    }

    handleResetFilters = (setState) => {
        const reset = {
            maxPrice: undefined,
            minPrice: undefined,
            type: undefined,
            color: undefined,
            sortBy: undefined,
            size: [],
            heelSize: [],
            brand: undefined,
            season: undefined,
            reason: undefined,
            search: undefined
        };

        if (setState) {
            this.setState({
                filters: {
                    ...this.state.filters,
                    ...reset
                }
            });
        } else {
            return reset;
        }
    };

    handleUpdatePriceFilter = (minPrice, maxPrice) => {
        this.setState({
            filters: {
                ...this.state.filters,
                maxPrice,
                minPrice
            }
        });
    };

    handleSelectPage = (page) => {
        this.setState({
            filters: {
                ...this.state.filters,
                page
            }
        });
    };

    getAllFilterValues = () => {
        const {filters} = this.context.newApi;

        return new Promise(resolve => {
            get(filters())
                .then(({data: filters}) => {
                    filters.sortBy = [
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
                    ];
                    resolve(filters);
                });
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
        const {feed, goods, pages, categoryName, availableFilters, filters} = this.state;
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
                                filters={filters}
                                onResetFilters={() => this.handleResetFilters(true)}
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
                                availableFilters={availableFilters}
                                filters={filters}
                                onSelectFilter={this.handleSelectFilter}
																handleFavoriteToggle={this.props.handleFavoriteToggle}
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