import React from 'react';
import PropTypes from 'prop-types';
import {NavLink} from 'react-router-dom';
import Pagination from './Pagination'

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

class CatalogueFeed extends React.Component {
    handleFavoriteClick(e, id){
        e.preventDefault();
        this.props.handleFavoriteToggle(id);
    }

    render() {
        const {feed, goods, pages, page, categoryName, onSelectFilter, filters, availableFilters} = this.props;

			const
					{favoriteStorageKey} = this.context,
					storageStr = localStorage.getItem(favoriteStorageKey),
					storageParsed = storageStr ? JSON.parse(storageStr) : [];

        return (
            <section className="product-catalogue-content">
                <section className="product-catalogue__head">
                    <div className="product-catalogue__section-title">
                        <h2 className="section-name">{categoryName}</h2><span
                        className="amount">Найдено товаров: {goods}</span>
                    </div>
                    <div className="product-catalogue__sort-by">
                        <p className="sort-by">Сортировать</p>
                        <Selector
                            value={filters.sortBy}
                            options={availableFilters.sortBy}
                            onSelectFilter={onSelectFilter}
                        />
                    </div>
                </section>

                <section className="product-catalogue__item-list">
                    {
                        feed.map(item => {
                            return (
                                <NavLink key={item.id} className="item-list__item-card item"
                                         to={`/product/?id=${item.id}`}>
                                    <div className="item-pic">
                                        <img
                                            src={item.images[0]}
                                            alt={item.title}
                                        />
                                        <div
                                            onClick={(e) => this.handleFavoriteClick(e, item.id)}
                                            className={`product-catalogue__product_favorite${storageParsed.includes(item.id) ? ' favorite' : ''}`}
                                        >
                                            <p></p>
                                        </div>
                                        {/*<div className="arrow arrow_left"/>*/}
                                        {/*<div className="arrow arrow_right"/>*/}
                                    </div>
                                    <div className="item-desc">
                                        <h4 className="item-name">{item.title}</h4>
                                        <p className="item-producer">Производитель: <span
                                            className="producer">{item.brand}</span></p>
                                        <p className="item-price">{item.price}</p>
                                        {/*<div className="sizes">*/}
                                        {/*<p className="sizes__title">Размеры в наличии:</p>*/}
                                        {/*<p className="sizes__avalible">36, 37, 38, 39, 40, 41, 42</p>*/}
                                        {/*</div>*/}
                                    </div>
                                </NavLink>
                            )
                        })
                    }
                </section>

                {
                    pages > 1 ?
                        <Pagination onSelectFilter={onSelectFilter} page={page} pages={pages}/> :
                        undefined
                }
            </section>
        )
    }
}

CatalogueFeed.contextTypes = {
	favoriteStorageKey: PropTypes.string.isRequired
};

CatalogueFeed.propTypes = {
    categoryName: PropTypes.string.isRequired,
    feed: PropTypes.array.isRequired,
    goods: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]).isRequired,
    pages: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]).isRequired,
    page: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]).isRequired,
    onSelectFilter: PropTypes.func.isRequired,
    availableFilters: PropTypes.object.isRequired,
    filters: PropTypes.shape({
        sortBy: PropTypes.string.isRequired
    }).isRequired
};

export default CatalogueFeed;