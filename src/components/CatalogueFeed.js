import React from 'react';
import PropsTypes from 'prop-types';
import {NavLink} from 'react-router-dom';
import Pagination from './Pagination'

class CatalogueFeed extends React.Component {

	render() {
		const {feed, goods, pages, page, categoryName, onSelectPage} = this.props;
		return (
				<section className="product-catalogue-content">
					<section className="product-catalogue__head">
						<div className="product-catalogue__section-title">
							<h2 className="section-name">{categoryName}</h2><span className="amount">Найдено товаров: {goods}</span>
						</div>
						<div className="product-catalogue__sort-by">
							<p className="sort-by">Сортировать</p>
							<select name="" id="sorting">
								<option value="">по популярности</option>
								<option value="">по размеру</option>
								<option value="">по производителю</option>
							</select>
						</div>
					</section>

					<section className="product-catalogue__item-list">

						{
							feed.map(item => {
								return (
										<NavLink key={item.id} className="item-list__item-card item" to={`/product/?id=${item.id}`}>
											<div className="item-pic">
												<img
														src={item.images[0]}
														alt={item.title}
												/>
												<div className="product-catalogue__product_favorite">
													<p></p>
												</div>
												{/*<div className="arrow arrow_left"/>*/}
												{/*<div className="arrow arrow_right"/>*/}
											</div>
											<div className="item-desc">
												<h4 className="item-name">{item.title}</h4>
												<p className="item-producer">Производитель: <span className="producer">{item.brand}</span></p>
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
								<Pagination onSelectPage={onSelectPage} page={page} pages={pages}/> :
								undefined
					}
				</section>
		)
	}
}

CatalogueFeed.propTypes = {
	categoryName: PropsTypes.string.isRequired,
	feed: PropsTypes.array.isRequired,
	goods: PropsTypes.oneOfType([
		PropsTypes.number,
		PropsTypes.string
	]).isRequired,
	pages: PropsTypes.oneOfType([
		PropsTypes.number,
		PropsTypes.string
	]).isRequired,
	page: PropsTypes.oneOfType([
		PropsTypes.number,
		PropsTypes.string
	]).isRequired,
	onSelectPage: PropsTypes.func.isRequired
};

export default CatalogueFeed;