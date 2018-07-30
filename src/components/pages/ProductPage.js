import React from 'react';
import {parse} from 'query-string';
import {get} from "../../utils/functions";
import PropTypes from "prop-types";

import '../../css/style-product-card.css'
import Breadcrumbs from '../Breadcrumbs';


const SizePicker = props => {
	return (
			<ul className="sizes">
				{
					props.sizes.map(size => {
								let className = '';

								if (!size.available) {
									className += ' not-available';
								}

								if (props.activeSize !== undefined && props.activeSize.size === size.size) {
									className += ' active';
								}

								return (
										<li
												key={size.size}
												data-size={size.size}
												onClick={size.available ? props.onSizeSelect : (e) => e.preventDefault()}
												className={className}
										>
											{
												size.available ?
														<a href="/">{size.size}</a> :
														<span>{size.size}</span>
											}

										</li>
								);
							}
					)
				}
			</ul>
	);
};

const AmountPicker = props => {
	return (
			<div className="basket-item__quantity">
				<div
						onClick={() => props.setAmount('decr')}
						className="basket-item__quantity-change basket-item-list__quantity-change_minus"
				>-</div>
				{props.activeAmount}
				<div
						onClick={() => props.setAmount('incr')}
						className="basket-item__quantity-change basket-item-list__quantity-change_plus"
				>+</div>
			</div>
	)
};


export default class ProductPage extends React.Component {
	state = {
		product: undefined,
		activeSize: undefined,
		activeAmount: 1
	};

	componentDidMount() {
		const productId = parse(this.props.location.search).id;
		const {api} = this.context;
		get(`${api}/products/${productId}`)
				.then(({data}) => this.setState({
					product: data,
					activeSize: data.sizes.find(size => size.available)
				}));
	}

	setActiveSize = (event) => {
		event.preventDefault();

		const {currentTarget: target} = event;
		const
				sizeSelected = parseInt(target.dataset.size, 10),
				{sizes} = this.state.product;

		if (!sizes || !sizeSelected || (this.state.activeSize && this.state.activeSize.size === sizeSelected)) {
			return;
		}

		const activeSizeObj = sizes.find(size => size.size === sizeSelected);

		this.setState({
			activeSize: activeSizeObj
		})
	};

	setAmount = type => {
		const {activeAmount} = this.state;

		if (activeAmount === 1 && type === 'decr') {
			return;
		}

		const newAmount = type === 'incr' ? (activeAmount + 1) :  (activeAmount - 1);

		this.setState({
			activeAmount: newAmount
		});
	};


	render() {
		const {product, activeSize, activeAmount} = this.state;
		return (
				<React.Fragment>
					<Breadcrumbs/>
					{
						product ?
								<main className="product-card">
									<section className="product-card-content">
										<h2 className="section-name">{product.title}</h2>
										<section className="product-card-content__main-screen">

											<section className="main-screen__favourite-product-slider">
												<div className="favourite-product-slider">
													<div className="favourite-product-slider__arrow favourite-product-slider__arrow_up arrow-up"/>
													{
														product.images.map((img, index) =>
																<div
																		key={index}
																		className="favourite-product-slider__item"
																		style={{backgroundImage: `url('${img}')`}}
																/>
														)
													}
													<div
															className="favourite-product-slider__arrow favourite-product-slider__arrow_down arrow-down"/>
												</div>
											</section>

											<div className="main-screen__favourite-product-pic">
												<a href="/">
													<img src={product.images[0]} alt=""/>
												</a>
												<a href="/" className="main-screen__favourite-product-pic__zoom"></a>
											</div>

											<div className="main-screen__product-info">
												<div className="product-info-title"><h2>{product.title}</h2>
													<div className="in-stock">В наличии (TODO)</div>
												</div>
												<div className="product-features">
													<table className="features-table">
														<tbody>
														<tr>
															<td className="left-col">Артикул:</td>
															<td className="right-col">{product.sku}</td>
														</tr>
														<tr>
															<td className="left-col">Производитель:</td>
															<td className="right-col"><a href="/"><span
																	className="producer">{product.brand}</span></a></td>
														</tr>
														<tr>
															<td className="left-col">Цвет:</td>
															<td className="right-col">{product.color}</td>
														</tr>
														<tr>
															<td className="left-col">Материалы:</td>
															<td className="right-col">{product.material}</td>
														</tr>
														<tr>
															<td className="left-col">Сезон:</td>
															<td className="right-col">{product.season}</td>
														</tr>
														<tr>
															<td className="left-col">Повод:</td>
															<td className="right-col">{product.reason}</td>
														</tr>
														</tbody>
													</table>
												</div>
												<p className="size">Размер</p>
												<SizePicker
														activeSize={activeSize}
														sizes={product.sizes}
														onSizeSelect={this.setActiveSize}
												/>
												<div className="size-wrapper">
													<a href="/"><span className="size-rule"></span><p className="size-table">Таблица размеров</p>
													</a>
												</div>
												<a href="/" className="in-favourites-wrapper">
													<div className="favourite" href="/"></div>
													<p className="in-favourites">В избранное</p>
												</a>
												<AmountPicker
														activeAmount={activeAmount}
														setAmount={this.setAmount}
												/>
												<div className="price">{product.price} ₽</div>
												<button className="in-basket in-basket-click">В корзину</button>
											</div>

										</section>
									</section>
								</main> :
								<div>Loading</div>
					}

				</React.Fragment>
		)
	}
}

ProductPage.contextTypes = {
	api: PropTypes.string.isRequired
};