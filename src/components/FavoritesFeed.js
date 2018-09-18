import React from 'react';
import PropTypes from 'prop-types';
import {NavLink} from 'react-router-dom';
import Pagination from './Pagination'

class FavoritesFeed extends React.Component {
    handleFavoriteClick(e, id) {
        e.preventDefault();
        this.props.handleFavoriteToggle(id);
    }

    render() {
        const {feedArray} = this.props;

        const
            {favoriteStorageKey} = this.context,
            storageStr = localStorage.getItem(favoriteStorageKey),
            storageParsed = storageStr ? JSON.parse(storageStr) : [];

        return (
            <section className="product-catalogue__item-list product-catalogue__item-list_favorite">
                {
                    feedArray.map(item => {
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
        )
    }
}

FavoritesFeed.contextTypes = {
    favoriteStorageKey: PropTypes.string.isRequired
};

FavoritesFeed.propTypes = {
    feedArray: PropTypes.array.isRequired,
    handleFavoriteToggle: PropTypes.func.isRequired,
    // pagesCount: PropTypes.number.isRequired,
    // currentPage: PropTypes.number.isRequired,

    // availableFilters: PropTypes.object.isRequired,
    // filters: PropTypes.shape({
    // 	sortBy: PropTypes.string.isRequired
    // }).isRequired
};

export default FavoritesFeed;